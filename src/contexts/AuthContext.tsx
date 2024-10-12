"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
        const memberDocRef = doc(db, "members", user.uid);
        const memberDocSnap = await getDoc(memberDocRef);

        if (memberDocSnap.exists()) {
          const memberData = memberDocSnap.data();

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
                memberDocRef,
                { firstName, lastName },
                { merge: true }
              );
              memberData.firstName = firstName;
              memberData.lastName = lastName;
            }
          }

          setMember({ id: user.uid, ...memberData } as Member);
        } else {
          // Create new member document if it doesn't exist
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

          await setDoc(memberDocRef, newMember);
          setMember({ id: user.uid, ...newMember });
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
      await firebaseSignOut(auth);
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
