export enum SprintStatus {
  NotStarted = "Not Started",
  Active = "Active",
  Done = "Done",
}

export const getSprintStatusColor = (status: SprintStatus) => {
  switch (status) {
    case SprintStatus.NotStarted:
      return "#FF6E6E";
    case SprintStatus.Active:
      return "#FFA500";
    case SprintStatus.Done:
      return "#34CB5E";
  }
};
