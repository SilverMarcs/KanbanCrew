// components/admin/AdminTeamBoard.tsx
"use client";

import { useState, useMemo } from "react";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { AddTeamMemberDialog } from "@/components/admin/AddTeamMemberDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Timestamp } from "@firebase/firestore";
import { UserAvatar } from "../UserAvatar";
import { MembersTable } from "../team-board/MembersTable";

export function AdminTeamBoard() {
  const members = useMembers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="min-h-screen py-12 px-24">
      <h1 className="text-4xl font-bold mb-6 text-primary">Admin Team Board</h1>

      <div className="flex justify-between items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <AddTeamMemberDialog />
      </div>

      {startDate && endDate && (
        <MembersTable
          members={members}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}
