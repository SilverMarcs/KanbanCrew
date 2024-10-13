import { useEffect, useState } from "react";
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
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

export function ResetSecurityQuestions() {
    const [isOpen, setIsOpen] = useState(false);
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