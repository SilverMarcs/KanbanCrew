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

export function ForgotPasswordButton({ isAdmin }: { isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminDocId, setAdminDocId] = useState<string | null>(null);
  const [questions, setQuestions] = useState(["", "", ""]);
  const [answers, setAnswers] = useState(["", "", ""]);

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

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!adminDocId) {
      setError("Admin document ID not found");
      return;
    }

    const adminRef = doc(db, "admin", adminDocId);
    try {
      await updateDoc(adminRef, {
        securityQuestions: questions.map((question, index) => ({
          question,
          answer: answers[index],
        })),
      });
      alert("Security questions updated successfully");
    } catch (error) {
      console.error("Error updating security questions: ", error);
      alert("Failed to update security questions");
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
          {isAdmin ?(
            <>
              <DialogTitle>Set Security Questions</DialogTitle>
              <DialogDescription>
                Set security questions and their answers
              </DialogDescription>
              {questions.map((question, index) => (
                <div key={index} className="grid gap-4 py-2">
                  <Input
                    placeholder={`Question ${index + 1}`}
                    value={question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                  />
                  <Input
                    placeholder={`Answer ${index + 1}`}
                    value={answers[index]}
                    onChange={(e) =>
                      handleAnswerChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
              <Button onClick={handleSubmit}>Submit</Button>
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
              <Button onClick={handlePasswordReset}>
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
