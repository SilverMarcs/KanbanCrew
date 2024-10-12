// components/admin/AddTeamMemberDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTeamMember } from "@/lib/createTeamMember";
import { db } from "@/lib/firebaseConfig"; // Import your Firestore instance
import { doc, setDoc } from "firebase/firestore";

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddMember(formData: FormData) {
    const result = await createTeamMember(formData);

    if (result.success && result.user) {
      try {
        // Create Firestore document
        await setDoc(doc(db, "members", result.user.uid), {
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          avatarUrl: "",
          hoursWorked: [],
        });

        setMessage("Team member added successfully");

        // Close the dialog after a short delay
        setTimeout(() => {
          setOpen(false);
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error("Error adding member to Firestore:", error);
        setMessage("Error adding member to database");
      }
    } else {
      setMessage(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Team Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <form action={handleAddMember} className="space-y-4">
          <Input
            name="firstName"
            type="text"
            placeholder="First Name"
            required
          />
          <Input name="lastName" type="text" placeholder="Last Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Button type="submit">Add Team Member</Button>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
