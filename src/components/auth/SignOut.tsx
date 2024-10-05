// components/auth/SignOut.tsx
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/useAuthActions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const SignOut = () => {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <Button onClick={handleSignOut} variant="ghost" size={"icon"}>
      <LogOut />
    </Button>
  );
};
