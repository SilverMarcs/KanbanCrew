"use client";

import { AuthCheck } from "@/components/AuthCheck";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation"; // New import for programmatic navigation

export default function TeamBoard() {
  const { loading, member } = useAuthContext();
  const router = useRouter(); // To programmatically navigate

  if (loading) {
    return <div>Loading...</div>; // or a more sophisticated loading spinner
  }

  const handleAdminClick = () => {
    router.push("/team-board/admin");
  };

  const handleTeamClick = () => {
    if (member && member.id) {
      router.push(`/team-board/member/${member.id}`);
    }
  };

  return (
    <AuthCheck>
      <div className="container mx-auto py-8">
        <h1 className="text-5xl font-bold mb-8 text-center">Team Board</h1>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleAdminClick}
            className="px-6 py-3 bg-card text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Admin
          </Button>
          <Button
            onClick={handleTeamClick}
            className="px-6 py-3 bg-card text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Team
          </Button>
        </div>
      </div>
    </AuthCheck>
  );
}
