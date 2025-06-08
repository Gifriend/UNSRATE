import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { Pagination } from "./Pagination";
import { PageInfo, User } from "@/app/types/adminTypes";

interface DashboardTabsProps {
  users: User[];
  pageInfo: PageInfo;
  onPageChange: (newPage: number) => void;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  filteredUsers: User[];
  pendingUsers: User[];
  verifiedUsers: User[];
  reportedUsers: User[];
}

export const DashboardTabs = ({
  pageInfo,
  onPageChange,
  onVerify,
  onDelete,
  filteredUsers,
  pendingUsers,
  verifiedUsers,
  reportedUsers,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu</TabsTrigger>
          <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
          <TabsTrigger value="reported">Laporan</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <UserTable
                users={filteredUsers}
                onVerify={onVerify}
                onDelete={onDelete}
              />
            </div>
            <Pagination pageInfo={pageInfo} onPageChange={onPageChange} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <UserTable
                users={pendingUsers}
                onVerify={onVerify}
                onDelete={onDelete}
              />
            </div>
            <Pagination pageInfo={pageInfo} onPageChange={onPageChange} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verified" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <UserTable
                users={verifiedUsers}
                onVerify={onVerify}
                onDelete={onDelete}
                showVerifyButton={false}
              />
            </div>
            <Pagination pageInfo={pageInfo} onPageChange={onPageChange} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reported" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <UserTable
                users={reportedUsers}
                onVerify={onVerify}
                onDelete={onDelete}
              />
            </div>
            <Pagination pageInfo={pageInfo} onPageChange={onPageChange} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};