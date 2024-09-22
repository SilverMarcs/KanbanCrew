import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import { SprintForm } from "./SprintForm";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SprintStatus } from "@/models/sprints/SprintStatus";

export const CreateSprintCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (
    name: String,
    status: SprintStatus,
    from: Date,
    to: Date
  ) => {
    try {
      await addDoc(collection(db, "sprints"), {
        name: name,
        sprintStatus: status,
        startDate: Timestamp.fromDate(from),
        endDate: Timestamp.fromDate(to),
      });

      toast({
        title: "Sprint created",
        description: (
          <div>
            <p>Status: {status}</p>
            <p>From: {format(from, "P")}</p>
            <p>To: {format(to, "P")}</p>
          </div>
        ),
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to create the sprint.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="hidden" />
      <DialogTrigger className="w-full" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center py-2">
            <PlusCircleIcon size={40} className="text-gray-300" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-yellow-200 max-w-lg border-0 shadow-lg">
        <DialogHeader>
          <SprintForm
            initialTitle="New Sprint"
            initialStatus={SprintStatus.NotStarted}
            onSubmit={onSubmit}
            submitButtonLabel="CREATE"
            isSprint={true}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
