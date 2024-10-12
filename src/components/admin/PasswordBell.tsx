// components/admin/PasswordBell.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useMembers } from "@/hooks/useMembers";
import { Member } from "@/models/Member";
import { UserAvatar } from "../UserAvatar";
import { resetUserPassword } from "@/lib/auth/resetUserPassword";
import { toast } from "@/components/ui/use-toast";

export function PasswordBell() {
  const [open, setOpen] = useState(false);
  const [emailsNeedingRecovery, setEmailsNeedingRecovery] = useState<string[]>(
    []
  );
  const members = useMembers();

  useEffect(() => {
    const fetchEmailsNeedingRecovery = async () => {
      const adminDocRef = doc(db, "admin", "6HNXdtPtvx2WlLp2e3HT");
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        setEmailsNeedingRecovery(
          adminDocSnap.data().emailNeedingRecovery || []
        );
      }
    };

    fetchEmailsNeedingRecovery();
  }, []);

  const resetPassword = async (member: Member) => {
    try {
      const result = await resetUserPassword(member.id, member.email);
      // Remove the email from the list of emails needing recovery
      const adminDocRef = doc(db, "admin", "6HNXdtPtvx2WlLp2e3HT");
      await updateDoc(adminDocRef, {
        emailNeedingRecovery: arrayRemove(member.email),
      });

      if (result.success) {
        setEmailsNeedingRecovery((prev) =>
          prev.filter((email) => email !== member.email)
        );
        toast({
          title: "Password Reset",
          description: `Password reset for ${member.firstName} ${member.lastName}`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const membersNeedingReset = members.filter((member) =>
    emailsNeedingRecovery.includes(member.email)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-6 w-6" />
          {emailsNeedingRecovery.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {emailsNeedingRecovery.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Users Needing Password Reset
          </h2>
          {membersNeedingReset.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2"
            >
              <UserAvatar member={member} size="md" showName showEmail />
              <Button
                variant="destructive"
                onClick={() => resetPassword(member)}
              >
                Reset
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
