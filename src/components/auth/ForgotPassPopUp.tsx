// @/components/auth/ForgotPassPopUp.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ForgotPasswordPopupProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
export const ForgotPassPopup: React.FC<ForgotPasswordPopupProps> = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handlePasswordReset = async () => {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent!");
        setError("");
        onClose(); // Close the modal on success
      } catch (error) {
        console.error("Error sending password reset email", error);
        setError("Failed to send password reset email");
        setMessage("");
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle className="hidden" />
          <DialogDescription>
            <motion.div
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <h2 className="text-xl font-bold mb-4">Reset Password</h2>
              <input 
                type="email" 
                placeholder="Email" 
                className="border border-gray-300 rounded p-2 mb-4 w-full max-w-xs" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <Button onClick={handlePasswordReset}>Send password reset email</Button>
              {message && <p className="text-green-500 mt-4">{message}</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </motion.div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  };