import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonLabel,
  cancelButtonLabel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yellow-200 max-w-lg border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p>{description}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button className="bg-gray-300 hover:bg-gray-400" onClick={onClose}>
              {cancelButtonLabel}
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={onConfirm}>
              {confirmButtonLabel}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
