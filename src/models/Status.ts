export enum Status {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
}

export const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.NotStarted:
      return "#FF6E6E";
    case Status.InProgress:
      return "#FFA500";
    case Status.Completed:
      return "#34CB5E";
  }
};
