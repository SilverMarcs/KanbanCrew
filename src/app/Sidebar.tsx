// components/Sidebar.tsx
"use client";

import {
  Component,
  Zap,
  ContactRound,
  Palette,
  Sun,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeCommandBox } from "@/components/themes/ThemeCommandBox";
import { ThemeToggle } from "@/components/themes/ThemeToggle";
import { SignOut } from "@/components/auth/SignOut";

const Sidebar = () => {
  const pathname = usePathname();

  const size = 33;

  // Sidebar items - icon and link
  const menuItems = [
    { icon: <Component size={size} />, link: "/productbacklog" },
    { icon: <Zap size={size} />, link: "/sprints" },
    { icon: <ContactRound size={size} />, link: "/team-board" },
  ];

  return (
    <div className="sidebar fixed h-full w-16 flex flex-col items-center py-4 z-50 bg-background">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <ThemeCommandBox />
        <ThemeToggle />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className={cn(
              "p-2 rounded-md",
              pathname === item.link
                ? "bg-primary/95 text-primary-foreground"
                : "text-secondary-foreground"
            )}
          >
            {item.icon}
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <SignOut />
      </div>
    </div>
  );
};

export default Sidebar;
