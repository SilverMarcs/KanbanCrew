// components/CreateTaskCard.tsx
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";

export const CreateTaskCard = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-96 h-full">
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center p-0">
            <PlusCircleIcon size={50} className="text-gray-300" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create a new card</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Click on the card to create a new card
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
