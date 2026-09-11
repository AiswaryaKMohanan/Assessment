"use client";

import { useState, type FormEvent } from "react";
import { PROJECT_OPTIONS, type DayTask } from "../../mock-data";

export type TaskDraft = {
  taskName: string;
  project: string;
  hours: string;
};

type FormErrors = Partial<Record<keyof TaskDraft, string>>;

function validate(draft: TaskDraft): FormErrors {
  const errors: FormErrors = {};

  if (!draft.taskName.trim()) {
    errors.taskName = "Task name is required.";
  } else if (draft.taskName.trim().length < 3) {
    errors.taskName = "Task name must be at least 3 characters.";
  }

  if (!draft.project) {
    errors.project = "Project is required.";
  }

  const hoursNumber = Number(draft.hours);
  if (!draft.hours.trim()) {
    errors.hours = "Hours is required.";
  } else if (Number.isNaN(hoursNumber)) {
    errors.hours = "Hours must be a number.";
  } else if (hoursNumber <= 0 || hoursNumber > 24) {
    errors.hours = "Hours must be between 0 and 24.";
  }

  return errors;
}

export function TaskModal({
  dayLabel,
  task,
  onClose,
  onSave,
}: {
  dayLabel: string;
  task?: DayTask;
  onClose: () => void;
  onSave: (draft: TaskDraft) => void;
}) {
  const [draft, setDraft] = useState<TaskDraft>(
    task
      ? {
          taskName: task.taskName,
          project: task.project,
          hours: String(task.hours),
        }
      : { taskName: "", project: "", hours: "" },
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange<K extends keyof TaskDraft>(field: K, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(draft);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(draft);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col rounded-lg border border-gray-200 bg-white p-6 opacity-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="task-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">{dayLabel}</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="taskName" className="text-sm text-gray-700">
              Task Name
            </label>
            <input
              id="taskName"
              type="text"
              value={draft.taskName}
              onChange={(e) => handleChange("taskName", e.target.value)}
              placeholder="e.g. Homepage Development"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            {errors.taskName && (
              <p className="text-xs text-red-600">{errors.taskName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="project" className="text-sm text-gray-700">
              Project
            </label>
            <select
              id="project"
              value={draft.project}
              onChange={(e) => handleChange("project", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Select a project</option>
              {PROJECT_OPTIONS.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
            {errors.project && (
              <p className="text-xs text-red-600">{errors.project}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="hours" className="text-sm text-gray-700">
              Hours
            </label>
            <input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={draft.hours}
              onChange={(e) => handleChange("hours", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            {errors.hours && (
              <p className="text-xs text-red-600">{errors.hours}</p>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
