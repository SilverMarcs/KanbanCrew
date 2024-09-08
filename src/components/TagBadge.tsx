import React from "react";
import { Tag, getTagColor } from "@/models/Tag";

interface TagBadgeProps {
  tag: Tag;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  const { bgColor } = getTagColor(tag);

  return (
    <div
      className={`${bgColor} py-1 px-3 rounded-full w-fit text-sm font-bold whitespace-nowrap`}
    >
      {tag}
    </div>
  );
};
