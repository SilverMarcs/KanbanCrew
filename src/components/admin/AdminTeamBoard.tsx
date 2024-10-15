// components/admin/AdminTeamBoard.tsx
"use client";

import { useState } from "react";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { AddTeamMemberDialog } from "@/components/admin/AddTeamMemberDialog";
import { MembersTable } from "./MembersTable";
import { PasswordBell } from "@/components/admin/PasswordBell";
import { ResetSecurityQuestions } from "@/components/admin/ResetSecurityQuestions";

export function AdminTeamBoard() {
  const members = useMembers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="min-h-screen py-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12 w-full">
        <h1 className="text-5xl font-bold text-primary text-center">
          Admin Team Board
        </h1>
        <PasswordBell />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <div className="flex space-x-4 -mt-1">
            <AddTeamMemberDialog />
            <ResetSecurityQuestions />
          </div>
        </div>

        {startDate && endDate && (
          <MembersTable
            members={members}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </div>
  );
}
