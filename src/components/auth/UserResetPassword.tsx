import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ForgotPasswordButton } from "@/components/auth/ForgotPasswordButton";

export function UserResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordResetRequest = async () => {
    const adminDocId = "6HNXdtPtvx2WlLp2e3HT";

    const adminRef = doc(db, "admin", adminDocId);

    try {
      await updateDoc(adminRef, {
        emailNeedingRecovery: arrayUnion(email),
      });
      setMessage("Password recovery request recorded!");
      setError("");
      setEmail("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error recording password recovery request", error);
      setError("Failed to record password recovery request");
      setMessage("");
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      // Reset the state when the dialog is closed
      setMessage("");
      setError("");
      setEmail("");
    }
  };

  return (
    <>
      <ForgotPasswordButton onClick={() => setIsOpen(true)} />
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
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
          {message && <p className="text-sm text-green-500 mt-2 mb-1">{message}</p>}
          {error && <p className="text-sm text-red-500 mt-2 mb-1">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}