import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ForgotPasswordButton } from "@/components/auth/ForgotPasswordButton";

export function AdminResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
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
      setError("");
      setNewPassword("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
        setIsAnswerCorrect(false);
        setProvidedAnswers([]);
      }, 2000);
    } catch (error) {
      console.error("Error updating password: ", error);
      setError("Failed to update password");
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      // Reset the state when the dialog is closed
      setError("");
      setProvidedAnswers([]);
      setNewPassword("");
      setIsAnswerCorrect(false);
    }
  };

  return (
    <>
      <ForgotPasswordButton onClick={() => setIsOpen(true)} />
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          {!isAnswerCorrect ? (
            <>
              <DialogTitle>Answer Security Questions</DialogTitle>
              <DialogDescription>
                Answer the security questions to reset your password.
              </DialogDescription>
              <div className="grid gap-4 py-2">
                {questions.map((question, index) => (
                  <div key={index}>
                    <Input
                      placeholder={`Question`}
                      value={question}
                      disabled
                    />
                    <Input
                      placeholder={`Answer`}
                      value={providedAnswers[index] || ""}
                      onChange={(e) => handleProvidedAnswerChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
                {error && <p className="text-sm text-red-500 mt-2 mb-1">{error}</p>}
              </div>
            </>
          ) : (
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
                {error && <p className="text-sm text-red-500 mt-2 mb-1">{error}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}