"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from "@/models/Member";
import { db } from "@/lib/firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { resetUserPassword } from "@/lib/auth/resetUserPassword";
import { deleteUser } from "@/lib/auth/deleteUser";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTasks } from "@/hooks/useTasks";
import { ReassignTasksDialog } from "./ReassignTasksDialog";

interface MemberEditProps {
  member: Member;
  onClose: () => void;
}

export const MemberEdit: React.FC<MemberEditProps> = ({ member, onClose }) => {
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const tasks = useTasks();

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const memberRef = doc(db, "members", member.id);
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
      console.error("Failed to update member:", error);
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const result = await resetUserPassword(member.id, member.email);
      if (result.success) {
        toast({
          title: "Password Reset",
          description: `Password reset for ${firstName} ${lastName} to the default password.`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = () => {
    const assignedTasks = tasks.filter(
      (task) => task.assignee.id === member.id
    );
    if (assignedTasks.length > 0) {
      setShowReassignDialog(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleReassignComplete = () => {
    setShowReassignDialog(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteUser(member.id);

      // Delete user document from Firestore
      const userRef = doc(db, "members", member.id);
      await deleteDoc(userRef);

      if (result.success) {
        toast({
          title: "Member Deleted",
          description: `${firstName} ${lastName} has been successfully deleted.`,
        });
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
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
            <label className="block text-sm font-medium text-muted-foreground/80">
              First Name
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground/80">
              Last Name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center mt-4 space-x-2">
            <Button
              onClick={handleDeleteMember}
              variant="destructive"
              disabled={isLoading}
              className="p-2"
            >
              <Trash size={20} />
            </Button>
            <Button
              onClick={handleResetPassword}
              variant="outline"
              disabled={isLoading}
            >
              Reset Password
            </Button>
            <div className="flex-grow" /> {/* Spacer */}
            <Button onClick={saveChanges} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {firstName} {lastName}'s account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showReassignDialog && (
        <ReassignTasksDialog
          member={member}
          onClose={() => setShowReassignDialog(false)}
          onComplete={handleReassignComplete}
        />
      )}
    </Dialog>
  );
};
