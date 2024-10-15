// app/team-board/admin/page.tsx
"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthCheck } from "@/components/AuthCheck";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminTeamBoard } from "@/components/admin/AdminTeamBoard";

export default function AdminPage() {
  const { loading } = useAuthContext();
  const [loggedIn, setLoggedIn] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedIn) {
    return <AdminLogin onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <AuthCheck>
      <AdminTeamBoard />
    </AuthCheck>
  );
}
