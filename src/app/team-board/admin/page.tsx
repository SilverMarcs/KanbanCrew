"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMembers } from "@/hooks/useMembers";
import { DateRangePicker } from "@/components/DateRangePicker";
import { MembersTable } from "@/components/team-board/MembersTable";

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

  return (
    <div className="bg-background min-h-screen py-12 px-24">
      <h1 className="text-4xl font-bold mb-6 text-primary">Admin Team Board</h1>

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
  );
}
