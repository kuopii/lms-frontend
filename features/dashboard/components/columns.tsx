"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DashboardItem } from "../../../types/dashboard";
import { Status } from "@/types/dashboard";
import { getStatusConfig } from "./get-status-config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, SquarePen, Trash } from "lucide-react";

export const studentColumns: ColumnDef<DashboardItem>[] = [
  { accessorKey: "test_name", header: "Test Name" },
  { accessorKey: "module", header: "Module" },
  { accessorKey: "deadline", header: "Deadline" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      const { label, icon, className } = getStatusConfig(status);

      return (
        <Badge className={cn("flex items-center gap-1 px-2 py-1", className)}>
          {icon}
          <span>{label}</span>
        </Badge>
      );
    },
  },
  { accessorKey: "grade", header: "Grade" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Link href={`/test/overview/${id}`}>
          <Button size="icon" variant="default" className="size-8">
            <Play />
          </Button>
        </Link>
      );
    },
  },
];

export const teacherColumns: ColumnDef<DashboardItem>[] = [
  { accessorKey: "test_name", header: "Test Name" },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "created_at", header: "Created At" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      const { label, icon, className } = getStatusConfig(status);

      return (
        <Badge className={cn("flex items-center gap-1 px-2 py-1", className)}>
          {icon}
          <span>{label}</span>
        </Badge>
      );
    },
  },
  { accessorKey: "attemps", header: "Attempts" },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original.id;
      const type = row.original.type_test;

      const handleDelete = () => {
        if (confirm("Are you sure you want to delete this test?")) {
          // panggil API delete di sini
          console.log("Deleting test with id:", id);
        }
      };

      return (
        <div className="flex items-center gap-3">
          <Link href={`/test/${type}/update/${id}`}>
            <Button size="icon" variant="outline" className="size-8">
              <SquarePen />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="destructive"
            className="size-8"
            onClick={handleDelete}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
