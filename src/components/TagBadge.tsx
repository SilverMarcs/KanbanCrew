import React from "react";
import { Tag, getTagColor } from "@/models/Tag";

interface TagBadgeProps {
    tag: Tag;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
    const { bgColor, textColor } = getTagColor(tag);

    return (
        <div
            className={`${bgColor} ${textColor} py-2 px-4 rounded-3xl text-xs font-bold`}
        >
            {tag}
        </div>
    );
};
