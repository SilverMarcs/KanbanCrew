"use client";

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
import { PencilIcon, ChartBarIcon } from "lucide-react"; // Ensure you have the correct icons for editing and viewing graphs
import { Member } from "@/models/Member";
import { UserAvatar } from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";
import { EffortGraph } from "@/components/member/EffortGraph";
import { eachDayOfInterval, format } from "date-fns"; // To generate the interval
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

    const avgHours =
      numberOfDays > 0 ? (totalHours / numberOfDays).toFixed(2) : "0";
    return avgHours === "0.00" ? "0" : avgHours;
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
            <TableHead>Member</TableHead>
            <TableHead>Avg Working Hours</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <UserAvatar member={member} size="md" />
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>{calculateAvgHours(member.hoursWorked)}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => handleGraphClick(member)}
                >
                  <ChartBarIcon /> Graph
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEditClick(member)}
                  className="ml-2"
                >
                  <PencilIcon /> Edit
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
