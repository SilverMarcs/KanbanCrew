"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/models/Member";
import { DateRangePicker } from "@/components/DateRangePicker";
import { EffortGraph } from "@/components/member/EffortGraph";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, eachDayOfInterval } from "date-fns";
import { UserAvatar } from "@/components/UserAvatar";
import { ChangePasswordDialog } from "@/components/member/ChangePasswordDialog";
import { useAuthContext } from "@/contexts/AuthContext";

export const MemberDetails = ({ memberId }: { memberId: string }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [showGraph, setShowGraph] = useState(false); // State to control graph visibility
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { user } = useAuthContext();
  const canChangePassword =
    user && user.providerData[0].providerId === "password";

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

  // Generate date range with hours worked, filling missing days with 0 hours
  const generateDateRangeWithHours = () => {
    if (!startDate || !endDate || !member) return [];

    // Generate all dates within the range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Fill missing dates with 0 hours
    return allDates.map((date) => {
      // Find all entries that match the current date
      const entriesForDate = member.hoursWorked.filter(
        (entry) =>
          format(entry.date.toDate(), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );

      // Sum the hours for all entries on the same date
      const totalHoursForDate = entriesForDate.reduce(
        (sum, entry) => sum + entry.hours,
        0
      );

      return {
        date: date,
        hours: totalHoursForDate,
      };
    });
  };

  // Calculate total and average hours worked
  const calculateTotalAndAverage = (
    filteredHoursWorked: { date: Date; hours: number }[]
  ) => {
    const totalHours = filteredHoursWorked.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const numberOfDays = filteredHoursWorked.length;
    const averageHours =
      numberOfDays > 0 ? (totalHours / numberOfDays).toFixed(2) : "0";
    return { totalHours, averageHours };
  };

  if (!member) return <div>Loading...</div>;

  const filteredHoursWorked = generateDateRangeWithHours();
  const { totalHours, averageHours } =
    calculateTotalAndAverage(filteredHoursWorked);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Member Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4 mb-6">
          <div className="flex items-center space-x-4">
            <UserAvatar member={member} size="xl" showEmail showName />
          </div>
          {canChangePassword && (
            <Button onClick={() => setIsChangePasswordOpen(true)}>
              Change Password
            </Button>
          )}
        </div>

        <ChangePasswordDialog
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />

        {/* Date Range Picker to filter hours worked */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {/* Conditionally render the Effort Graph button, table, total, and average only if startDate and endDate are selected */}
        {startDate && endDate && (
          <>
            {/* Button to display Effort Graph */}
            <div className="mb-6">
              <Button
                className="bg-primary w-full mt-4"
                onClick={() => setShowGraph(true)}
              >
                View Effort Graph (Last 7 Days)
              </Button>
            </div>

            {showGraph && (
              <EffortGraph
                hoursWorked={filteredHoursWorked}
                open={showGraph}
                onClose={() => setShowGraph(false)}
              />
            )}

            {/* Display Total and Average Hours */}
            <div className="mb-6">
              <p>
                Total Hours Worked: <strong>{totalHours}</strong>
              </p>
              <p>
                Average Hours per Day: <strong>{averageHours}</strong>
              </p>
            </div>

            {/* Table showing hours worked */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours Worked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHoursWorked.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(entry.date, "PPP")}</TableCell>
                    <TableCell>{entry.hours} hours</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};
