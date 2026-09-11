"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TIMESHEET_ROWS, type TimesheetStatus } from "./mock-data";

const STATUS_STYLES: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  INCOMPLETE: "bg-yellow-100 text-yellow-700",
  MISSING: "bg-red-100 text-red-700",
};

const ACTION_LABEL: Record<TimesheetStatus, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

const STATUS_OPTIONS: Array<TimesheetStatus | "All"> = [
  "All",
  "COMPLETED",
  "INCOMPLETE",
  "MISSING",
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const window = 1;

  for (let p = 1; p <= total; p++) {
    if (
      p === 1 ||
      p === total ||
      (p >= current - window && p <= current + window)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export function TimesheetTable() {
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "All">(
    "All",
  );
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (statusFilter === "All") return TIMESHEET_ROWS;
    return TIMESHEET_ROWS.filter((row) => row.status === statusFilter);
  }, [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleStatusChange(status: TimesheetStatus | "All") {
    setStatusFilter(status);
    setStatusOpen(false);
    setPage(1);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPageSizeOpen(false);
    setPage(1);
  }

  return (
    <section className="mx-auto w-full max-w-5xl rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Your Timesheets
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-500"
            >
              Date Range
              <ChevronIcon />
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setStatusOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {statusFilter === "All" ? "Status" : statusFilter}
              <ChevronIcon open={statusOpen} />
            </button>

            {statusOpen && (
              <div className="absolute left-0 z-10 mt-1 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleStatusChange(option)}
                    className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {option === "All" ? "All" : option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium tracking-wide text-gray-500">
                <th className="py-2 pr-4">WEEK #</th>
                <th className="py-2 pr-4">DATE</th>
                <th className="py-2 pr-4">STATUS</th>
                <th className="py-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.week} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-900">{row.week}</td>
                  <td className="py-3 pr-4 text-gray-500">{row.dateRange}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/dashboard/timesheets/${row.week}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {ACTION_LABEL[row.status]}
                    </Link>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No timesheets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPageSizeOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {pageSize} per page
              <ChevronIcon open={pageSizeOpen} />
            </button>

            {pageSizeOpen && (
              <div className="absolute bottom-full left-0 z-10 mb-1 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handlePageSizeChange(size)}
                    className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {size} per page
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-40"
            >
              Previous
            </button>

            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded ${
                    p === currentPage
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
