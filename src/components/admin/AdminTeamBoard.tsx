// components/admin/AdminTeamBoard.tsx
"use client";

import { useState } from "react";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { AddTeamMemberDialog } from "@/components/admin/AddTeamMemberDialog";
import { MembersTable } from "../team-board/MembersTable";
import { PasswordBell } from "@/components/admin/PasswordBell";
import { ResetSecurityQuestions } from "@/components/admin/ResetSecurityQuestions";

export function AdminTeamBoard() {
  const members = useMembers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="min-h-screen p-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-bold text-primary">Admin Team Board</h1>
        <PasswordBell />
      </div>

      <div className="flex justify-between items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <AddTeamMemberDialog />
      </div>
      <div>
        <ResetSecurityQuestions />
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
