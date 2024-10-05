import React, { useState } from "react";
import { Tag, getTagColor } from "@/models/Tag";

interface TagDotProps {
  tag: Tag;
}

export const TagDot: React.FC<TagDotProps> = ({ tag }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { bgColor, textColor } = getTagColor(tag);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tag Dot */}
      <div className={`${bgColor} w-4 h-4 rounded-full`} aria-label={tag} />

      {/* Tag Tooltip */}
      <div
        className={`
          absolute -top-8 px-2 py-1 rounded-md text-xs
          transition-all duration-300 ease-in-out z-50
          ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }
          ${bgColor} ${textColor} whitespace-nowrap
        `}
      >
        {tag}
      </div>
    </div>
  );
};
