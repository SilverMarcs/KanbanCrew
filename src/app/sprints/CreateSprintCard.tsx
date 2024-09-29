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
import { CreateSprintForm } from "./CreateSprintForm";

export const CreateSprintCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="hidden" />
      <DialogTrigger className="w-full" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center py-2">
            <PlusCircleIcon size={40} className="text-gray-400" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-lg border-0 shadow-lg">
        <DialogHeader>
          <CreateSprintForm onSuccess={handleSuccess} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
