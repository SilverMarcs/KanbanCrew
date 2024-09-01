export enum Tag {
    Frontend = "Frontend",
    Backend = "Backend",
    API = "API",
    Database = "Database",
    Testing = "Testing",
    UIUX = "UI/UX",
    Framework = "Framework",
}

export const TagColors: Record<Tag, ColorScheme> = {
    [Tag.Frontend]: { bgColor: "bg-blue-300", textColor: "text-blue-600" },
    [Tag.Backend]: { bgColor: "bg-green-300", textColor: "text-green-600" },
    [Tag.API]: { bgColor: "bg-yellow-300", textColor: "text-yellow-600" },
    [Tag.Database]: { bgColor: "bg-red-300", textColor: "text-red-600" },
    [Tag.Testing]: { bgColor: "bg-purple-300", textColor: "text-purple-600" },
    [Tag.UIUX]: { bgColor: "bg-pink-300", textColor: "text-pink-600" },
    [Tag.Framework]: { bgColor: "bg-indigo-300", textColor: "text-indigo-600" },
};

export const getTagColor = (tag: Tag): ColorScheme => {
    return TagColors[tag];
};