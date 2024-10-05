// app/team-board/page.tsx
"use client";

import { AuthCheck } from "@/components/AuthCheck";
import { useAuthContext } from "@/contexts/AuthContext";

export default function TeamBoard() {
  const { loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // or a more sophisticated loading spinner
  }

  return (
    <AuthCheck>
      <div>
        <h1 className="text-5xl font-bold mb-8">Team Board</h1>
      </div>
    </AuthCheck>
  );
}
