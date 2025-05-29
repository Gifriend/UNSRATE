// components/Pagination.tsx
import { Button } from "@/components/ui/button";
import { PageInfo } from "@/app/types/adminTypes";

interface PaginationProps {
  pageInfo: PageInfo;
  onPageChange: (newPage: number) => void;
}

export const Pagination = ({ pageInfo, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-t">
      <div className="text-sm text-muted-foreground">
        Halaman {pageInfo.currentPage + 1} dari {pageInfo.totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={pageInfo.currentPage === 0}
          onClick={() => onPageChange(pageInfo.currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={pageInfo.currentPage === pageInfo.totalPages - 1}
          onClick={() => onPageChange(pageInfo.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};