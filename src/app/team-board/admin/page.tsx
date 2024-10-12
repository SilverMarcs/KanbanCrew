"use client";

import { useState } from "react";
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
import { useAuthContext } from "@/contexts/AuthContext";
import { useMembers } from "@/hooks/useMembers";
import { ChartBarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export default function AdminTeamBoard() {
  const { loading } = useAuthContext();
  const members = useMembers();
  const [loggedIn, setLoggedIn] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-secondary">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Admin Login</h1>
          <Button
            className="bg-primary text-primary-foreground w-full mt-4"
            onClick={() => setLoggedIn(true)} // Temporary login
          >
            Login as Admin
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="bg-background min-h-screen py-12 px-24">
      <h1 className="text-4xl font-bold mb-6 text-primary">Admin Team Board</h1>

      {/* Date Pickers for Start and End Dates */}
      <div className="mb-8 flex space-x-4">
        <div>
          <label className="block mb-2 text-sm font-bold text-primary">
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-start text-left font-normal"
              >
                {startDate ? format(startDate, "PPP") : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-primary">
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-start text-left font-normal"
              >
                {endDate ? format(endDate, "PPP") : "Pick an end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Conditionally render the table only when both startDate and endDate are selected */}
      {startDate && endDate && (
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
      )}
    </div>
  );
}
