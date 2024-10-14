import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { ChevronDown } from "lucide-react";

const COMMON_QUESTIONS = [
  "What is your pet's name?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What city were you born in?",
  "What is your favorite color?"
];

export function ResetSecurityQuestions() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminDocId, setAdminDocId] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(["", "", ""]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);

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
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[index] = value;
    setSelectedQuestions(newSelectedQuestions);
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
        securityQuestions: selectedQuestions.map((question, index) => ({
          question,
          answer: answers[index],
        })),
      });
      setMessage("Security questions updated successfully");
      setError("");
      setTimeout(() => {
        setIsOpen(false); // Close the modal after delay
        setMessage("");
        setSelectedQuestions(["", "", ""]);
        setAnswers(["", "", ""]);
      }, 2000);
    } catch (error) {
      console.error("Error updating security questions: ", error);
      setError("Failed to update security questions");
      setMessage("");
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      // Reset the state when the dialog is closed
      setError("");
      setMessage("");
      setSelectedQuestions(["", "", ""]);
      setAnswers(["", "", ""]);
    }
  };


  return (
    <>
      <Button className="" onClick={() => setIsOpen(true)}>
        Reset Security Questions
      </Button>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <>
            <DialogTitle>Set Security Questions</DialogTitle>
            <DialogDescription>
              Select 3 security questions and provide their answers
            </DialogDescription>
            {selectedQuestions.map((question, index) => (
              <div key={index} className="grid gap-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between px-3 py-2">
                      {question || "Select a question"}
                      <ChevronDown className="ml-2" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {COMMON_QUESTIONS.map((commonQuestion, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onSelect={() => handleQuestionChange(index, commonQuestion)}
                      >
                        {commonQuestion}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  placeholder={`Answer`}
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
            {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}