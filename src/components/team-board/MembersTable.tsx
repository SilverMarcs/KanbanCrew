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
import { Member } from "@/models/Member"; // Assuming you have a Member type defined somewhere
import { UserAvatar } from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { EffortGraph } from "@/components/member/EffortGraph";

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

  const calculateAvgHours = (
    hoursWorked?: { date: Timestamp; hours: number }[]
  ) => {
    if (!hoursWorked || hoursWorked.length === 0 || !startDate || !endDate) {
      return 0; // Return 0 if no data or date range is selected
    }

    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime() + 24 * 60 * 60 * 1000 - 1; // End of the day

    const filteredHours = hoursWorked.filter(
      (entry) =>
        entry.date.toMillis() >= startMillis &&
        entry.date.toMillis() <= endMillis
    );

    if (filteredHours.length === 0) return 0;

    const totalHours = filteredHours.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    return (totalHours / filteredHours.length).toFixed(2);
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
