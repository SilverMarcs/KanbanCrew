import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react"; // Assuming you are using lucide-react for icons
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ForgotPasswordButton } from "@/components/auth/ForgotPasswordButton";

export function AdminResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adminDocId, setAdminDocId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [providedAnswer, setProvidedAnswer] = useState<string>("");
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

  const handleAnswerSubmit = async () => {
    const questionIndex = questions.indexOf(selectedQuestion);
    if (questionIndex !== -1 && answers[questionIndex] === providedAnswer) {
      setIsAnswerCorrect(true);
      setError("");
    } else {
      setError("Incorrect answer to the security question");
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
      setMessage("Password updated successfully!");
      setError("");
      setNewPassword("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
        setIsAnswerCorrect(false);
        setSelectedQuestion("");
        setProvidedAnswer("");
        setMessage("");
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
      setProvidedAnswer("");
      setNewPassword("");
      setIsAnswerCorrect(false);
      setSelectedQuestion("");
    }
  };

  return (
    <>
      <ForgotPasswordButton onClick={() => setIsOpen(true)} />
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          {!isAnswerCorrect ? (
            <>
              <DialogTitle>Answer Security Question</DialogTitle>
              <DialogDescription>
                Answer one of the security questions to reset your password.
              </DialogDescription>
              <div className="grid gap-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between px-3 py-2">
                      <span>{selectedQuestion || "Select a question"}</span>
                      <ChevronDown className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full border border-gray-300">
                    {questions.map((question, index) => (
                      <DropdownMenuItem
                        key={index}
                        onSelect={() => setSelectedQuestion(question)}
                        className="w-full text-left px-4 py-2"
                      >
                        {question}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  placeholder={`Answer`}
                  value={providedAnswer}
                  onChange={(e) => setProvidedAnswer(e.target.value)}
                />
                <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
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
                {message && <p className="text-sm text-green-500 mt-4">{message}</p>}
                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}