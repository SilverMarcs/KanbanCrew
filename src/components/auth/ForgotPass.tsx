import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ForgotPassPopup } from '@/components/auth/ForgotPassPopUp';

export const ForgotPass: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    return (
      <div className="mt-4">
        <Button onClick={() => setIsDialogOpen(true)}>Forgot Password?</Button>
        <ForgotPassPopup
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)} adminDocId={""} />
      </div>
    );
  };