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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartBarIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { Member } from "@/models/Member"; // Assuming you have a Member type defined somewhere

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

  return (
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
              <Avatar>
                <AvatarImage
                  src={member.avatarUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                />
                <AvatarFallback>
                  {member.firstName.charAt(0)}
                  {member.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {member.firstName} {member.lastName}
              </div>
            </TableCell>
            <TableCell className="ml-12">
              {calculateAvgHours(member.hoursWorked)}
            </TableCell>
            <TableCell>
              <Button className="bg-transparent text-primary">
                <ChartBarIcon size={24} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
