// components/UserTable.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/adminTypes";

interface UserTableProps {
  users: User[];
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  showVerifyButton?: boolean;
}

export const UserTable = ({
  users,
  onVerify,
  onDelete,
  showVerifyButton = true,
}: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Belum ada data yang tersedia
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-4 font-medium">Nama</th>
          <th className="text-left p-4 font-medium">NIM</th>
          <th className="text-left p-4 font-medium">Status</th>
          <th className="text-left p-4 font-medium">Laporan</th>
          <th className="text-right p-4 font-medium">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-muted/50">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user.profilePicture ||
                      `/placeholder.svg?height=32&width=32`
                    }
                    alt={user.fullname}
                  />
                  <AvatarFallback>{user.fullname[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.fullname}</span>
              </div>
            </td>
            <td className="p-4 text-muted-foreground">{user.nim || "-"}</td>
            <td className="p-4">
              <Badge variant={user.verified ? "success" : "warning"}>
                {user.verified ? "Verified" : "Pending"}
              </Badge>
            </td>
            <td className="p-4">
              {user.reportCount > 0 ? (
                <Badge variant="destructive">{user.reportCount} laporan</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Tidak ada</span>
              )}
            </td>
            <td className="p-4 text-right">
              <div className="flex justify-end gap-2">
                {!user.verified && showVerifyButton && (
                  <Button
                    onClick={() => onVerify(user.id)}
                    size="sm"
                    variant="outline"
                  >
                    Verify
                  </Button>
                )}
                <Button
                  onClick={() => onDelete(user.id)}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};