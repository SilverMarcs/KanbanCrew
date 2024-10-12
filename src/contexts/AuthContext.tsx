"use client";
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Member } from "@/models/Member";

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  member: null,
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const membersRef = collection(db, "members");
        const querySnapshot = await getDocs(
          query(membersRef, where("email", "==", user.email))
        );

        if (!querySnapshot.empty) {
          const memberDoc = querySnapshot.docs[0];
          const memberData = memberDoc.data();

          // Check if user's display name has changed
          if (user.displayName) {
            const nameParts = user.displayName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ");

            if (
              memberData.firstName !== firstName ||
              memberData.lastName !== lastName
            ) {
              // Update Firestore document with new name
              await setDoc(
                memberDoc.ref,
                { firstName, lastName },
                { merge: true }
              );
              memberData.firstName = firstName;
              memberData.lastName = lastName;
            }
          }

          setMember({ id: memberDoc.id, ...memberData } as Member);
        } else {
          // Create new member document if it doesn't exist
          const newMemberRef = doc(collection(db, "members"));
          let firstName = "",
            lastName = "";

          if (user.displayName) {
            const nameParts = user.displayName.split(" ");
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ");
          }

          const newMember: Omit<Member, "id"> = {
            avatarUrl: user.photoURL || "",
            firstName,
            lastName,
            email: user.email || "",
            hoursWorked: [],
          };

          await setDoc(newMemberRef, newMember);
          setMember({ id: newMemberRef.id, ...newMember });
        }
      } else {
        setMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await signOut();
      setUser(null);
      setMember(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, member, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
