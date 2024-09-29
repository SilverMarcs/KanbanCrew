"use client";

import Image from "next/image";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";

export function BackgroundImage() {
  const bgImageName = useBackgroundImage((state) => state.bgImageName);

  if (!bgImageName) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={`/images/${bgImageName}.jpg`}
        layout="fill"
        objectFit="cover"
        quality={50}
        alt="Background"
        className="saturate-200"
        style={{
          opacity: 0.75,
        }}
      />
    </div>
  );
}
