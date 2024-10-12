// components/MemberDetails.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from "@/models/Member";

export const MemberDetails = ({ memberId }: { memberId: string }) => {
  const { user } = useAuthContext();
  const [member, setMember] = useState<Member | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      const docRef = doc(db, "members", memberId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMember({ id: docSnap.id, ...docSnap.data() } as Member);
      }
    };
    fetchMember();
  }, [memberId]);

  const handlePasswordChange = async () => {
    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        "Failed to update password. Please check your current password and try again."
      );
    }
  };

  if (!member) return <div>Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Member Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={member.avatarUrl}
              alt={`${member.firstName} ${member.lastName}`}
            />
            <AvatarFallback>
              {member.firstName[0]}
              {member.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-gray-500">{member.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Hours Worked</h3>
          {member.hoursWorked.length > 0 ? (
            <ul>
              {member.hoursWorked.map((entry, index) => (
                <li key={index}>
                  {entry.date.toDate().toLocaleDateString()}: {entry.hours}{" "}
                  hours
                </li>
              ))}
            </ul>
          ) : (
            <p>No hours recorded yet.</p>
          )}
        </div>

        {user && user.providerData[0].providerId === "password" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-500 mb-2">{message}</p>}
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handlePasswordChange}>Change Password</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
