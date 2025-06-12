"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { UserTable } from "./UserTable"
import { ReportedUsersTable } from "./ReportedUserTable"
import type { User, PageInfo } from "@/app/types/adminTypes"
import type { ReportedUser } from "@/app/services/admin-report"

interface DashboardTabsProps {
  users: User[]
  pageInfo: PageInfo
  onPageChange: (page: number) => void
  onVerify: (id: string) => void
  onDelete: (id: string) => void
  filteredUsers: User[]
  pendingUsers: User[]
  verifiedUsers: User[]
  reportedUsers: User[]
  reportedUsersData: ReportedUser[]
}

export const DashboardTabs = ({
  users,
  pageInfo,
  onPageChange,
  onVerify,
  onDelete,
  filteredUsers,
  pendingUsers,
  verifiedUsers,
  reportedUsers,
  reportedUsersData,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">Semua ({filteredUsers.length})</TabsTrigger>
        <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
        <TabsTrigger value="verified">Verified ({verifiedUsers.length})</TabsTrigger>
        <TabsTrigger value="reported">Dilaporkan ({reportedUsersData.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Semua Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable users={filteredUsers} onVerify={onVerify} onDelete={onDelete} />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Halaman {pageInfo.currentPage + 1} dari {pageInfo.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pageInfo.currentPage - 1)}
                  disabled={pageInfo.currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pageInfo.currentPage + 1)}
                  disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending">
        <Card>
          <CardHeader>
            <CardTitle>Mahasiswa Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable users={pendingUsers} onVerify={onVerify} onDelete={onDelete} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verified">
        <Card>
          <CardHeader>
            <CardTitle>Mahasiswa Terverifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable users={verifiedUsers} onVerify={onVerify} onDelete={onDelete} showVerifyButton={false} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reported">
        <Card>
          <CardHeader>
            <CardTitle>Pengguna yang Dilaporkan</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportedUsersTable reportedUsers={reportedUsersData} onDelete={onDelete} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
