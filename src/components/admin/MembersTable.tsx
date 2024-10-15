import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, ChartBarIcon } from "lucide-react";
import { Member } from "@/models/Member";
import { UserAvatar } from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";
import { EffortGraph } from "@/components/member/EffortGraph";
import { eachDayOfInterval, format } from "date-fns";
import { MemberEdit } from "@/components/admin/MemberEdit";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

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
    return numberOfDays > 0 ? (totalHours / numberOfDays).toFixed(2) : "0";
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleGraphClick = (member: Member) => {
    setSelectedMember(member);
    setShowGraph(true);
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Member</TableHead>
            <TableHead className="w-1/4 text-center">
              Avg Working Hours
            </TableHead>
            <TableHead className="w-1/4 text-center">Effort Graph</TableHead>
            <TableHead></TableHead>
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
              <TableCell className="text-center">
                {calculateAvgHours(member.hoursWorked)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="secondary"
                  onClick={() => handleGraphClick(member)}
                >
                  <ChartBarIcon />
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" onClick={() => handleEditClick(member)}>
                  <PencilIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedMember && showGraph && (
        <EffortGraph
          hoursWorked={selectedMember.hoursWorked}
          open={showGraph}
          onClose={() => setShowGraph(false)}
        />
      )}
      {selectedMember && isEditDialogOpen && (
        <MemberEdit
          member={selectedMember}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </Card>
  );
}
