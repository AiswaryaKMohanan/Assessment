import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimesheetTable } from "../timesheet-table";

describe("TimesheetTable", () => {
  it("renders the timesheet columns and first page of rows", () => {
    render(<TimesheetTable />);

    expect(screen.getByText("Your Timesheets")).toBeInTheDocument();
    expect(screen.getByText("WEEK #")).toBeInTheDocument();
    expect(screen.getByText("DATE")).toBeInTheDocument();
    expect(screen.getByText("STATUS")).toBeInTheDocument();
    expect(screen.getByText("ACTIONS")).toBeInTheDocument();

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(5);
  });

  it("filters rows by status", async () => {
    const user = userEvent.setup();
    render(<TimesheetTable />);

    await user.click(screen.getByRole("button", { name: /status/i }));
    await user.click(screen.getByRole("button", { name: "MISSING" }));

    const rows = screen.getAllByRole("row").slice(1);
    for (const row of rows) {
      expect(within(row).getByText("MISSING")).toBeInTheDocument();
      expect(within(row).getByRole("link", { name: "Create" })).toBeInTheDocument();
    }
  });

  it("changes page size and updates visible row count", async () => {
    const user = userEvent.setup();
    render(<TimesheetTable />);

    await user.click(screen.getByRole("button", { name: /5 per page/i }));
    await user.click(screen.getByRole("button", { name: "10 per page" }));

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(10);
  });

  it("links each action to the week's detail page", () => {
    render(<TimesheetTable />);

    const rows = screen.getAllByRole("row").slice(1);
    const firstRowLink = within(rows[0]).getByRole("link");
    expect(firstRowLink).toHaveAttribute(
      "href",
      "/dashboard/timesheets/1",
    );
  });
});
