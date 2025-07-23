"use client";

import { ColumnDef, Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/types/auth";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCirclePlay, FaTrash } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DashboardData = {
  id: string;
  testName?: string;
  module?: string;
  deadline?: string;
  status?: string;
  grade?: string;
  type?: string;
  attempts?: string;
};

// COMPONENT
function ActionCellLeaderboard({ row }: { row: Row<DashboardData> }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const data = row.original;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ActionCellDashboardTeacher({ row }: { row: Row<DashboardData> }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const data = row.original;

  return (
    // panggil dialog disini
    <div className="flex gap-3">
      <Link href={`/dashboard/${data.id}`}>
        <MdEditSquare color="#ffffff" className="size-[24px]" />
      </Link>
      <FaTrash color="#ffffff" className="size-[22px]" />
    </div>
  );
}

export function useColumns(role: Role) {
  const pathname = usePathname();

  const isDashboardRoot = pathname === "/dashboard";

  console.log("role di columns table?", role);

  const studentColumns: ColumnDef<DashboardData>[] = [
    {
      accessorKey: "testName",
      header: "Test Name",
    },
    {
      accessorKey: "module",
      header: "Module",
    },

    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => {
        const createdAt = row.getValue("deadline") as string | number | Date;
        const formattedDate = dayjs(createdAt).format("YYYY-MM-DD");
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const allData = row.original;
        console.log("allData", allData);

        return (
          <div className="flex gap-3">
            <FaCirclePlay color="#ffffff" className="size-[24px]" />
          </div>
        );
      },
    },
  ];

  const teacherColumns: ColumnDef<DashboardData>[] = isDashboardRoot
    ? [
        {
          accessorKey: "testName",
          header: "Test Name",
        },
        {
          accessorKey: "class",
          header: "Class",
        },
        {
          accessorKey: "created_date",
          header: "Created Date",
        },
        {
          accessorKey: "status",
          header: "Status",
        },
        {
          accessorKey: "attempts",
          header: "Attempts",
        },
      ]
    : [
        {
          accessorKey: "number",
          header: "No",
        },
        {
          accessorKey: "studentName",
          header: "Student Name",
        },
        {
          accessorKey: "submissionDate",
          header: "Submission Date",
        },
        {
          accessorKey: "status",
          header: "Status",
        },
        {
          accessorKey: "score",
          header: "Score",
        },
      ];

  const actionColumnsTeacher: ColumnDef<DashboardData> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      isDashboardRoot ? (
        <ActionCellDashboardTeacher row={row} />
      ) : (
        <ActionCellLeaderboard row={row} />
      ),
  };

  if (role === Role.STUDENT) {
    return [...studentColumns];
  } else {
    return [...teacherColumns, actionColumnsTeacher];
  }
}
