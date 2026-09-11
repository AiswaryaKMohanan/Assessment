"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WEEKLY_HOURS_TARGET,
  type DayEntry,
  type DayTask,
  type TimesheetRow,
} from "../../mock-data";
import { TaskModal, type TaskDraft } from "./task-modal";
import { TaskRow } from "./task-row";

type ModalState = { dayIndex: number; task?: DayTask };

export function WeeklyTimesheet({ row }: { row: TimesheetRow }) {
  const [days, setDays] = useState<DayEntry[]>(row.days);
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const totalHours = days.reduce(
    (sum, day) => sum + day.tasks.reduce((daySum, t) => daySum + t.hours, 0),
    0,
  );
  const percent = Math.min(
    100,
    Math.round((totalHours / WEEKLY_HOURS_TARGET) * 100),
  );

  function handleSaveTask(draft: TaskDraft) {
    if (!modalState) return;
    const { dayIndex, task } = modalState;

    setDays((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;

        if (task) {
          return {
            ...day,
            tasks: day.tasks.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    taskName: draft.taskName,
                    project: draft.project,
                    hours: Number(draft.hours),
                  }
                : t,
            ),
          };
        }

        const newTask: DayTask = {
          id: `${row.week}-${dayIndex}-${Date.now()}`,
          taskName: draft.taskName,
          project: draft.project,
          hours: Number(draft.hours),
        };
        return { ...day, tasks: [...day.tasks, newTask] };
      }),
    );

    setModalState(null);
  }

  function handleDeleteTask(dayIndex: number, taskId: string) {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, tasks: day.tasks.filter((t) => t.id !== taskId) }
          : day,
      ),
    );
  }

  const activeDay = modalState ? days[modalState.dayIndex] : null;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back to timesheets
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            This week&apos;s timesheet
          </h1>
          <p className="mt-1 text-sm text-gray-400">{row.dateRange}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-700">
            {totalHours}/{WEEKLY_HOURS_TARGET} hrs
          </p>
          <p className="text-sm text-gray-400">{percent}%</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-orange-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {days.map((day, dayIndex) => (
          <div key={day.label}>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              {day.label}
            </h2>

            <div className="flex flex-col gap-2">
              {day.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={() => setModalState({ dayIndex, task })}
                  onDelete={() => handleDeleteTask(dayIndex, task.id)}
                />
              ))}

              <button
                type="button"
                onClick={() => setModalState({ dayIndex })}
                className="rounded-md border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                + Add new task
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalState && activeDay && (
        <TaskModal
          dayLabel={activeDay.label}
          task={modalState.task}
          onClose={() => setModalState(null)}
          onSave={handleSaveTask}
        />
      )}
    </section>
  );
}
