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
    [Tag.Frontend]: { bgColor: "tag-frontend", textColor: "" },
    [Tag.Backend]: { bgColor: "tag-backend", textColor: "" },
    [Tag.API]: { bgColor: "tag-api", textColor: "" },
    [Tag.Database]: { bgColor: "tag-database", textColor: "" },
    [Tag.Testing]: { bgColor: "tag-testing", textColor: "" },
    [Tag.UIUX]: { bgColor: "tag-uiux", textColor: "" },
    [Tag.Framework]: { bgColor: "tag-framework", textColor: "" },
};

export const getTagColor = (tag: Tag): ColorScheme => {
    return TagColors[tag];
};