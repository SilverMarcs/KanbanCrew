"use client";

import { Component, Zap, ContactRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility function from shadcn

const Sidebar = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Sidebar items - icon and link
  const menuItems = [
    { icon: <Component size={36} />, link: "/" },
    { icon: <Zap size={36} />, link: "/sprints" },
    { icon: <ContactRound size={36} />, link: "/team-board" },
  ];

  return (
    <div className="sidebar fixed h-full w-16 flex flex-col items-center justify-center py-4 space-y-6 z-50 bg-background">
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className={cn(
            "p-2 rounded-md",
            currentPath === item.link
              ? "bg-primary/95 text-primary-foreground"
              : "text-secondary-foreground"
          )}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
