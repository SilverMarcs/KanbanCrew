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
import { DateRangePicker } from "@/components/DateRangePicker"; // Assuming you have DateRangePicker

export const MemberDetails = ({ memberId }: { memberId: string }) => {
  const { user } = useAuthContext();
  const [member, setMember] = useState<Member | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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

  // Helper function to filter hoursWorked based on the date range
  const filterHoursWorked = () => {
    if (!startDate || !endDate || !member) return [];

    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime() + 24 * 60 * 60 * 1000 - 1; // Include the end date till the end of the day

    return member.hoursWorked.filter(
      (entry) =>
        entry.date.toMillis() >= startMillis &&
        entry.date.toMillis() <= endMillis
    );
  };

  // Helper function to calculate total and average hours worked
  const calculateHoursStats = (
    filteredHours: { date: any; hours: number }[]
  ) => {
    const totalHours = filteredHours.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const numberOfDays =
      endDate && startDate
        ? Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1
        : 1; // Avoid division by 0, so assume at least 1 day

    const avgHours =
      numberOfDays > 0 ? (totalHours / numberOfDays).toFixed(2) : "0";
    return { totalHours, avgHours };
  };

  if (!member) return <div>Loading...</div>;

  const filteredHoursWorked = filterHoursWorked();
  const { totalHours, avgHours } = calculateHoursStats(filteredHoursWorked);

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

        {/* Date Range Picker to filter hours worked */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {/* Only show the filtered hours once both start and end dates are selected */}
        {startDate && endDate && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Hours Worked</h3>

            {/* Display Total and Average Hours */}
            <div className="mb-4">
              <p>
                Total Hours: <span className="font-bold">{totalHours}</span>
              </p>
              <p>
                Average Hours per Day:{" "}
                <span className="font-bold">{avgHours}</span>
              </p>
            </div>

            {filteredHoursWorked.length > 0 ? (
              <ul>
                {filteredHoursWorked.map((entry, index) => (
                  <li key={index}>
                    {entry.date.toDate().toLocaleDateString()}: {entry.hours}{" "}
                    hours
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hours recorded in this range.</p>
            )}
          </div>
        )}

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
