// app/sprints/page.tsx
"use client";

import { AuthCheck } from "@/components/AuthCheck";
import SprintList from "@/components/sprint/SprintList";
import { useAuthContext } from "@/contexts/AuthContext";

export default function SprintsPage() {
  const { loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // or a more sophisticated loading spinner
  }

  return (
    <AuthCheck>
      <div className="p-7">
        <SprintList />
      </div>
    </AuthCheck>
  );
}
