"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type BackgroundImageStore = {
  bgImageName: string;
  setBgImageName: (name: string) => void;
};

export const useBackgroundImage = create<BackgroundImageStore>()(
  persist(
    (set) => ({
      bgImageName: "",
      setBgImageName: (name) => set({ bgImageName: name }),
    }),
    {
      name: "background-image-storage",
    }
  )
);
