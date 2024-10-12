// app/team-board/admin/page.tsx
"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { MembersTable } from "@/components/team-board/MembersTable";
import { AuthCheck } from "@/components/AuthCheck";
import { AdminLogin } from "./AdminLogin";
import { AddTeamMemberDialog } from "@/components/admin/AddTeamMemberDialog";

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
    // Show login until successful
    return <AdminLogin onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <AuthCheck>
      <div className="min-h-screen py-12 px-24">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          Admin Team Board
        </h1>

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
          <MembersTable
            members={members}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </AuthCheck>
  );
}
