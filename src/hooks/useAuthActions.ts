// hooks/useAuthActions.ts
import { useCallback } from "react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

export const useAuthActions = () => {
  const router = useRouter();

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/"); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [router]);

  return { signOut };
};
