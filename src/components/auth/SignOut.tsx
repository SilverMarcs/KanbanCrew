import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/useAuthActions";

export const SignOut = () => {
  const { signOut } = useAuthActions();

  return <Button onClick={signOut}>Sign Out</Button>;
};
