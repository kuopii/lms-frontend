"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownWideNarrow, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { BsSliders } from "react-icons/bs";
import { FilterDialog } from "./page";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isStudent?: boolean;
  isTeacher?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isStudent,
  isTeacher,
}: DataTableProps<TData, TValue>) {
  const pathname = usePathname();
  const [openFilter, setOpenFilter] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const isDashboard = pathname === "/dashboard";

  const possibleKeys = ["testName", "studentName"] as const;

  const availableColumn = table
    .getAllColumns()
    .find((col) =>
      possibleKeys.includes(col.id as (typeof possibleKeys)[number]),
    );

  const accessorKey = availableColumn?.id;
  console.log("accessorKey", accessorKey);

  return (
    <div className="flex flex-col gap-[25px]">
      <div className="flex items-center justify-between gap-20">
        <h2 className="w-fit border-b-2 border-white text-[16px] font-medium md:text-[22px]">
          {isDashboard ? "Task Overview" : "Leaderboard"}
        </h2>
        <div className="flex items-center justify-center gap-[20px]">
          {accessorKey && (
            <Input
              endIcon={Search}
              iconSize={24}
              placeholder={`Filter by ${accessorKey}...`}
              value={
                (table.getColumn(accessorKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(accessorKey)?.setFilterValue(event.target.value)
              }
              className="w-full rounded-[30px] border border-[#dedede] md:w-[250px] lg:w-[350px] xl:w-[500px]"
            />
          )}

          {isStudent && (
            <Button className="hover:text-primary bg-transparent hover:bg-transparent">
              <ArrowDownWideNarrow className="size-[25px]" />
            </Button>
          )}

          {/*  FILTER  */}
          <Button
            onClick={() => setOpenFilter(true)}
            variant="outline"
            className="border-none"
          >
            <BsSliders className="size-[25px]" />
          </Button>

          {openFilter && (
            <FilterDialog
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          )}
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="pt-4 pb-[25px] text-[16px] text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-[20px] text-[16px] text-white"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
