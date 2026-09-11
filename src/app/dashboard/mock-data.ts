export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export type DayTask = {
  id: string;
  taskName: string;
  project: string;
  hours: number;
};

export type DayEntry = {
  label: string;
  tasks: DayTask[];
};

export type TimesheetRow = {
  week: number;
  dateRange: string;
  status: TimesheetStatus;
  days: DayEntry[];
};

export const PROJECT_OPTIONS = [
  "Project Name",
  "Internal Tools",
  "Client Website",
  "Mobile App",
  "Marketing Site",
];

export const WEEKLY_HOURS_TARGET = 40;

function formatRange(start: Date, end: Date) {
  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });

  if (startMonth === endMonth) {
    return `${start.getDate()} - ${end.getDate()} ${endMonth}, ${end.getFullYear()}`;
  }

  return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}, ${end.getFullYear()}`;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_CYCLE: TimesheetStatus[] = [
  "COMPLETED",
  "COMPLETED",
  "INCOMPLETE",
  "COMPLETED",
  "MISSING",
];

const TASKS_PER_DAY_BY_STATUS: Record<TimesheetStatus, number[]> = {
  COMPLETED: [2, 2, 2, 2, 2],
  INCOMPLETE: [2, 2, 2, 0, 0],
  MISSING: [0, 0, 0, 0, 0],
};

function buildDays(week: number, start: Date, status: TimesheetStatus): DayEntry[] {
  const taskCounts = TASKS_PER_DAY_BY_STATUS[status];

  return taskCounts.map((count, dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);

    const tasks: DayTask[] = Array.from({ length: count }, (_, taskIndex) => ({
      id: `${week}-${dayIndex}-${taskIndex}`,
      taskName: "Homepage Development",
      project: PROJECT_OPTIONS[0],
      hours: 4,
    }));

    return { label: formatDayLabel(date), tasks };
  });
}

const TOTAL_WEEKS = 99;

export const TIMESHEET_ROWS: TimesheetRow[] = Array.from(
  { length: TOTAL_WEEKS },
  (_, i) => {
    const week = i + 1;
    const start = new Date(2024, 0, 1 + i * 7);
    const end = new Date(2024, 0, 5 + i * 7);
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];

    return {
      week,
      dateRange: formatRange(start, end),
      status,
      days: buildDays(week, start, status),
    };
  },
);

export function getTimesheetRow(week: number): TimesheetRow | undefined {
  return TIMESHEET_ROWS.find((row) => row.week === week);
}
