import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebaseConfig"; // Import your Firestore instance
import { doc, setDoc, updateDoc } from "firebase/firestore";

export function ResetSecurityQuestions() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [adminDocId, setAdminDocId] = useState<string | null>(null);
    const [questions, setQuestions] = useState(["", "", ""]);
    const [answers, setAnswers] = useState(["", "", ""]);

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
      setMessage("Security questions updated successfully");
      setError("");
      setEmail("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
      }, 2000);
    } catch (error) {
      console.error("Error updating security questions: ", error);
      setError("Failed to update security questions");
      setMessage("");
    }
  };

  return (
    <>
      <Button
        className=""
        onClick={() => setIsOpen(true)}
      >
        Reset Security Questions
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
        </DialogContent>
      </Dialog>
    </>
  );
}