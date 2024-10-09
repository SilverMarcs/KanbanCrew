// @/components/auth/ForgotPassPopUp.tsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateDoc, doc, arrayUnion, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface ForgotPasswordPopupProps {
    isOpen: boolean;
    onClose: () => void;
    adminDocId: string; //to pass the admin documengt ID
  }
  
export const ForgotPassPopup: React.FC<ForgotPasswordPopupProps> = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [adminDocId, setAdminDocId] = useState<string | null>(null);

    useEffect(() => {
      const fetchAdminDocId = async () => {
        try {
          const adminCollection = collection(db, "admin");
          const adminSnapshot = await getDocs(adminCollection);
          if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            setAdminDocId(adminDoc.id);
          } else {
            setError("No admin document found");
          }
        } catch (error) {
          console.error("Error fetching admin document ID", error);
          setError("Failed to fetch admin document ID");
        }
      };
  
      fetchAdminDocId();
    }, []);
  
    const handlePasswordReset = async () => {
      if (!adminDocId) {
        setError("Admin document ID not found");
        return;
      }
      
      const adminRef = doc(db, "admin", adminDocId);

      try {
        await updateDoc(adminRef, {
          emailNeedingRecovery: arrayUnion(email), //adds email if it doesnt already exist
        });
        setMessage("Password recovery request recorded!");
        setError("");
        onClose(); // Close the modal on success
      } catch (error) {
        console.error("Error recording password recovery request", error);
        setError("Failed to record password recovery request");
        setMessage("");
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle className="hidden" />
          <DialogDescription>
            <div
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
              <Button>Send password reset email</Button>
              {message && <p className="text-green-500 mt-4">{message}</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  };