"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member } from '@/models/Member';
import { db } from '@/lib/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { resetUserPassword } from "@/lib/auth/resetUserPassword";
import { toast } from "@/components/ui/use-toast";

interface MemberEditProps {
  member: Member;
  onClose: () => void;
}

export const MemberEdit: React.FC<MemberEditProps> = ({ member, onClose }) => {
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [isLoading, setIsLoading] = useState(false);

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const memberRef = doc(db, 'members', member.id);
      await updateDoc(memberRef, {
        firstName,
        lastName,
      });

      toast({
        title: "Member Updated",
        description: "Member information has been successfully updated.",
      });

      onClose();
    } catch (error) {
      console.error('Failed to update member:', error);
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Member</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};  