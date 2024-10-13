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
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function ForgotPasswordButton({ isAdmin }: { isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminDocId, setAdminDocId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [providedAnswers, setProvidedAnswers] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchAdminDocId = async () => {
      try {
        const adminCollection = collection(db, "admin");
        const adminSnapshot = await getDocs(adminCollection);
        if (!adminSnapshot.empty) {
          const adminDoc = adminSnapshot.docs[0];
          setAdminDocId(adminDoc.id);
          const adminData = adminDoc.data();
          setQuestions(adminData.securityQuestions.map((q: any) => q.question));
          setAnswers(adminData.securityQuestions.map((q: any) => q.answer));
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

  const handlePasswordResetRequest = async () => {  
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
        setMessage("")
      }, 2000);
    } catch (error) {
      console.error("Error recording password recovery request", error);
      setError("Failed to record password recovery request");
      setMessage("");
    }
  };

  const handleProvidedAnswerChange = (index: number, value: string) => {
    const newProvidedAnswers = [...providedAnswers];
    newProvidedAnswers[index] = value;
    setProvidedAnswers(newProvidedAnswers);
  };

  const handleAnswerSubmit = async () => {
    if (!adminDocId) {
      setError("Admin document ID not found");
      return;
    }

    const allAnswersCorrect = answers.every((answer, index) => answer === providedAnswers[index]);

    if (allAnswersCorrect) {
      setIsAnswerCorrect(true);
      setError("");
    } else {
      setError("Incorrect answer to the security questions");
      setIsAnswerCorrect(false);
    }
  };

  const handleChangePassword = async () => {
    if (!adminDocId) {
      setError("Admin document ID not found");
      return;
    }

    const adminRef = doc(db, "admin", adminDocId);

    try {
      await updateDoc(adminRef, {
        password: newPassword,
      });
      setMessage("Password updated successfully");
      setError("");
      setNewPassword("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
        setMessage("")
      }, 2000);
    } catch (error) {
      console.error("Error updating password: ", error);
      setError("Failed to update password");
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
          {isAdmin ? (
            <>
              <DialogTitle>Answer Security Questions</DialogTitle>
              <DialogDescription>
                Answer the security questions to reset your password.
              </DialogDescription>
              <div className="grid gap-4 py-2">
                {questions.map((question, index) => (
                  <div key={index}>
                    <Input
                      placeholder={`Question ${index + 1}`}
                      value={question}
                      disabled
                    />
                    <Input
                      placeholder={`Answer ${index + 1}`}
                      value={providedAnswers[index] || ""}
                      onChange={(e) => handleProvidedAnswerChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <Button onClick={handleAnswerSubmit}>Submit Answers</Button>
              </div>
              {isAnswerCorrect && (
                <>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your new password.
                  </DialogDescription>
                  <div className="grid gap-4 py-2">
                    <Input
                      placeholder="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button onClick={handleChangePassword}>Change Password</Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
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
              {message && <p className="text-green-500 mt-4">{message}</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}