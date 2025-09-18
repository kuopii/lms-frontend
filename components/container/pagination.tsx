import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  setPage: (newPage: number) => void;
  totalPages: number;
  handleQueryParams?: (newPage: number) => void;
}

export const Pagination = ({
  page,
  setPage,
  totalPages,
  handleQueryParams,
}: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (handleQueryParams) {
      handleQueryParams(newPage);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Button Previous */}
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <IoIosArrowForward size={16} className="rotate-180" />
      </Button>

      {/* Page Information */}
      <span className="text-sm text-nowrap">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </span>

      {/* Button Next */}
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        <IoIosArrowForward size={16} />
      </Button>
    </div>
  );
};
