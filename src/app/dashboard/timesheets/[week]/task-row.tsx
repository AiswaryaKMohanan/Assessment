"use client";

import { useEffect, useRef, useState } from "react";
import type { DayTask } from "../../mock-data";

export function TaskRow({
  task,
  onEdit,
  onDelete,
}: {
  task: DayTask;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-gray-900">
        {task.taskName}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">{task.hours} hrs</span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {task.project}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Task actions"
            className="px-1 text-gray-400 hover:text-gray-600"
          >
            &#8230;
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
