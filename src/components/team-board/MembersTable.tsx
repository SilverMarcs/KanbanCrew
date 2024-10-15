"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartBarIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { Member } from "@/models/Member";
import { UserAvatar } from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { EffortGraph } from "@/components/member/EffortGraph";
import { eachDayOfInterval, format } from "date-fns";

interface MembersTableProps {
  members: Member[];
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export function MembersTable({
  members,
  startDate,
  endDate,
}: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Function to generate date range and fill missing days with 0 hours
  const generateDateRangeWithHours = (
    hoursWorked: { date: Timestamp; hours: number }[]
  ) => {
    if (!startDate || !endDate) return [];

    // Generate all dates within the range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Fill missing dates with 0 hours
    return allDates.map((date) => {
      const entry = hoursWorked.find(
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

  // Function to calculate average hours
  const calculateAvgHours = (
    hoursWorked?: { date: Timestamp; hours: number }[]
  ) => {
    if (!hoursWorked || hoursWorked.length === 0 || !startDate || !endDate) {
      return 0; // Return 0 if no data or date range is selected
    }

    const filteredHoursWorked = generateDateRangeWithHours(hoursWorked);

    const totalHours = filteredHoursWorked.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const numberOfDays = filteredHoursWorked.length;

    const avgHours =
      numberOfDays > 0 ? (totalHours / numberOfDays).toFixed(2) : "0";
    return avgHours === "0.00" ? "0" : avgHours;
  };

  const handleGraphClick = (member: Member) => {
    setSelectedMember(member);
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Member</TableHead>
            <TableHead className="w-1/4">Avg Working Hours</TableHead>
            <TableHead className="w-1/6">Effort Graph</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex space-x-4 items-center">
                <UserAvatar member={member} size="md" />
                <div>
                  {member.firstName} {member.lastName}
                </div>
              </TableCell>
              <TableCell className="ml-12">
                {calculateAvgHours(member.hoursWorked)}
              </TableCell>
              <TableCell>
                <Button
                  variant={"secondary"}
                  onClick={() => handleGraphClick(member)}
                >
                  <ChartBarIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedMember && (
        <EffortGraph
          hoursWorked={selectedMember.hoursWorked}
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </Card>
  );
}
