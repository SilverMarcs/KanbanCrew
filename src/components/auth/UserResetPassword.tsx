import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ForgotPasswordButton } from "@/components/auth/ForgotPasswordButton";
import { useToast } from "@/components/ui/use-toast";

export function UserResetPassword() {
  const { toast } = useToast(); // Hook for toasts
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return email.trim() !== "" && email.includes("@");
  };

  const handlePasswordResetRequest = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const adminDocId = "6HNXdtPtvx2WlLp2e3HT";
    const adminRef = doc(db, "admin", adminDocId);

    try {
      await updateDoc(adminRef, {
        emailNeedingRecovery: arrayUnion(email),
      });
      toast({
        title: "Success",
        description: "Password recovery request recorded!",
        variant: "default", // You can use 'default' or any other variant
      });
      setEmail(""); // Clear email after successful request
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record password recovery request.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ForgotPasswordButton onClick={() => setIsOpen(true)} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter email address to send password reset request for
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handlePasswordResetRequest}>
            Send Password Reset Request
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
