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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  member: null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);

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
          setMember({ id: memberDoc.id, ...memberDoc.data() } as Member);
        } else {
          const newMemberRef = doc(collection(db, "members"));
          const newMember: Omit<Member, "id"> = {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
          };
          await setDoc(newMemberRef, newMember);
          setMember({ id: newMemberRef.id, ...newMember });
        }
      } else {
        setMember(null);
      }
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
    <AuthContext.Provider value={{ user, member }}>
      {children}
    </AuthContext.Provider>
  );
};
