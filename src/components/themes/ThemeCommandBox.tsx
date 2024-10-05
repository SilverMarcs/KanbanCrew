"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";

const themes = [
  {
    bgImageName: "ocean",
    label: "Ocean",
  },
  {
    bgImageName: "forest",
    label: "Forest",
  },
  {
    bgImageName: "d&w",
    label: "Deadpool",
  },
  {
    bgImageName: "clear",
    label: "Clear",
  },
];

export function ThemeCommandBox() {
  const [open, setOpen] = React.useState(false);
  const bgImageName = useBackgroundImage((state) => state.bgImageName);
  const setBgImageName = useBackgroundImage((state) => state.setBgImageName);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          size={"icon"}
        >
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0">
        <Command>
          <CommandInput placeholder="Theme" />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {themes.map((theme) => (
                <CommandItem
                  key={theme.bgImageName}
                  value={theme.bgImageName}
                  onSelect={(newTheme) => {
                    setBgImageName(newTheme === "clear" ? "" : newTheme); // TODO: maybe theres a better way to do this?
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      bgImageName === theme.bgImageName
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {theme.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
