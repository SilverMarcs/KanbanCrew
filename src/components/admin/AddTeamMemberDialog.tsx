// @/components/admin/AddTeamMemberDialog.tsx
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

export const AddTeamMemberDialog = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        "password12345"
      );
      const user = userCredential.user;

      // Create the member document in Firestore
      await setDoc(doc(db, "members", user.uid), {
        firstName,
        lastName,
        email,
        avatarUrl: "",
        hoursWorked: [],
      });

      setMessage("Team member added successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error adding team member:", error);
      setMessage("Error adding team member. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Team Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Add Team Member</Button>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};
