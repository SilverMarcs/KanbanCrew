// components/admin/AdminTeamBoard.tsx
"use client";

import { useState, useMemo } from "react";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { AddTeamMemberDialog } from "@/components/admin/AddTeamMemberDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Timestamp } from "@firebase/firestore";
import { UserAvatar } from "../UserAvatar";

export function AdminTeamBoard() {
  const members = useMembers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredMembers = useMemo(() => {
    if (!startDate || !endDate) return [];

    const start = Timestamp.fromDate(startDate);
    const end = Timestamp.fromDate(endDate);

    return members
      .filter((member) =>
        member.hoursWorked.some(
          (entry) =>
            entry.date.toDate() >= start.toDate() &&
            entry.date.toDate() <= end.toDate()
        )
      )
      .map((member) => {
        const relevantHours = member.hoursWorked.filter(
          (entry) =>
            entry.date.toDate() >= start.toDate() &&
            entry.date.toDate() <= end.toDate()
        );

        const totalHours = relevantHours.reduce(
          (sum, entry) => sum + entry.hours,
          0
        );
        const dayCount =
          (end.toDate().getTime() - start.toDate().getTime()) /
            (1000 * 3600 * 24) +
          1;
        const averageHoursPerDay = totalHours / dayCount;

        return {
          ...member,
          averageHoursPerDay,
        };
      });
  }, [members, startDate, endDate]);

  return (
    <div className="min-h-screen py-12 px-24">
      <h1 className="text-4xl font-bold mb-6 text-primary">Admin Team Board</h1>

      <div className="flex justify-end mb-6">
        <AddTeamMemberDialog />
      </div>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {startDate && endDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center p-4">
                <div className="flex items-center flex-1">
                  <div className="mr-4">
                    <UserAvatar member={member} size="lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Avg. Hours/Day</p>
                  <p className="text-lg font-bold text-primary">
                    {member.averageHoursPerDay.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
