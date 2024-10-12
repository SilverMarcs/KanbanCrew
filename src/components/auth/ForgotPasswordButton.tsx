"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  updateDoc,
  doc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function ForgotPasswordButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
        emailNeedingRecovery: arrayUnion(email),
      });
      setMessage("Password recovery request recorded!");
      setError("");
      setEmail("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
      }, 2000);
    } catch (error) {
      console.error("Error recording password recovery request", error);
      setError("Failed to record password recovery request");
      setMessage("");
    }
  };

  return (
    <>
      <Button
        variant="link"
        className="text-left justify-start px-1 text-xs text-muted-foreground -mt-1"
        onClick={() => setIsOpen(true)}
      >
        Forgot password?
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a password reset link.
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
          <Button onClick={handlePasswordReset}>
            Send password reset email
          </Button>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
