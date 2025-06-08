import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogOut } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleLogout: () => void;
}

export const DashboardHeader = ({
  searchQuery,
  setSearchQuery,
  handleLogout,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Kelola mahasiswa dan verifikasi akun
        </p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mahasiswa..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
            <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        </div>
      </div>
    </div>
  );
};