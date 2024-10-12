"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { format, eachDayOfInterval } from "date-fns"; // Importing utility to generate date intervals

export const MemberDetails = ({ memberId }: { memberId: string }) => {
  const { user } = useAuthContext();
  const [member, setMember] = useState<Member | null>(null);
  const [showGraph, setShowGraph] = useState(false); // State to control graph visibility
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

  // Generate date range with hours worked, filling missing days with 0 hours
  const generateDateRangeWithHours = () => {
    if (!startDate || !endDate || !member) return [];

    // Generate all dates within the range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Fill missing dates with 0 hours
    return allDates.map((date) => {
      const entry = member.hoursWorked.find(
        (entry) =>
          format(entry.date.toDate(), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );
      return {
        date: date,
        hours: entry ? entry.hours : 0, // Set hours to 0 if not found
      };
    });
  };

  if (!member) return <div>Loading...</div>;

  const filteredHoursWorked = generateDateRangeWithHours();

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
      </CardContent>
    </Card>
  );
};
