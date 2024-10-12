// components/ChangePasswordDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebaseConfig";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@radix-ui/react-toast";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "No user is currently logged in.",
        variant: "destructive",
      });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast({
        title: "Success",
        description: "Your password has been successfully changed.",
      });

      onClose();
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Failed to change password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ToastProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ToastProvider>
  );
};
