// app/member/[member_id]/page.tsx
"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { MemberDetails } from "@/components/member/MemberDetails";
import { AuthCheck } from "@/components/AuthCheck";

interface MemberPageProps {
  params: {
    member_id: string;
  };
}

export default function MemberPage({ params }: MemberPageProps) {
  const { member: loggedInMember } = useAuthContext();

  return (
    <AuthCheck>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Team Member</h1>
        {loggedInMember && loggedInMember.id === params.member_id ? (
          <MemberDetails memberId={params.member_id} />
        ) : (
          <p>You don't have permission to view this member's details.</p>
        )}
      </div>
    </AuthCheck>
  );
}
