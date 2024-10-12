"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMembers } from "@/hooks/useMembers";

export default function AdminTeamBoard() {
  const { loading } = useAuthContext();
  const members = useMembers();
  const [loggedIn, setLoggedIn] = useState(false);

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Member</TableHead>
            <TableHead className="w-1/4">Avg Working Hours</TableHead>
            <TableHead className="w-1/6">Effort Graph</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex space-x-4 items-center">
                <Avatar>
                  <AvatarImage
                    src={member.avatarUrl}
                    alt={`${member.firstName} ${member.lastName}`}
                  />
                  <AvatarFallback>
                    {member.firstName.charAt(0)}
                    {member.lastName.charAt(0)}
                  </AvatarFallback>{" "}
                </Avatar>
                <div>
                  {member.firstName} {member.lastName}
                </div>
              </TableCell>
              <TableCell className="ml-12">
                {Math.floor(Math.random() * 10) + 1}
              </TableCell>{" "}
              {/* Random average hours for now */}
              <TableCell>
                <Button className="bg-transparent text-primary">
                  <ChartBarIcon size={24} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
