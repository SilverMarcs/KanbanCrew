// components/auth/SignOut.tsx
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/UserAvatar";

export const SignOut = () => {
  const { signOut } = useAuthActions();
  const { member } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!member) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none rounded-full hover:border-white shadow-lg transition-all">
          <UserAvatar member={member} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-50">
        <div className="flex flex-col space-y-2">
          <p>
            {member.firstName} {member.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{member.email}</p>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
