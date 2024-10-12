// components/auth/GoogleSignIn.tsx
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const GoogleSignIn = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/productbacklog");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <Button onClick={handleSignIn} variant="outline">
      Sign in with Google
    </Button>
  );
};
