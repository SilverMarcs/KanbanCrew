"use client";

import { useRouter } from "next/navigation"; // New import for programmatic navigation

interface MemberPageProps {
  params: {
    member_id: string;
  };
}

export default function MemberPage({ params }: MemberPageProps) {
  return (
    <div>
      <h1>Team Member</h1>
      <p>Member ID: {params.member_id}</p>
    </div>
  );
}
