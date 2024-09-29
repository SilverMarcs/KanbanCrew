"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between"
        >
          {bgImageName
            ? themes.find((theme) => theme.bgImageName === bgImageName)?.label
            : "Theme"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    setBgImageName(newTheme);
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
