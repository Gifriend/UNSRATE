"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Calendar, User } from "lucide-react"
import { type ReportedUser, type UserReport, reportApi } from "@/app/services/admin-report"

interface ReportedUsersTableProps {
  reportedUsers: ReportedUser[]
  onDelete: (id: string) => void
}

export const ReportedUsersTable = ({ reportedUsers, onDelete }: ReportedUsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<ReportedUser | null>(null)
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleViewReports = async (user: ReportedUser) => {
    try {
      setLoading(true)
      setSelectedUser(user)
      const reports = await reportApi.getReportsForUser(user.user.id)
      setUserReports(reports)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Failed to fetch user reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (reportedUsers.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Belum ada pengguna yang dilaporkan</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {reportedUsers.map((reportedUser) => (
          <Card key={reportedUser.user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={reportedUser.user.profilePicture || "/placeholder.svg"}
                      alt={reportedUser.user.fullname}
                    />
                    <AvatarFallback>{reportedUser.user.fullname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{reportedUser.user.fullname}</h3>
                    <p className="text-sm text-muted-foreground">NIM: {reportedUser.user.nim}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive">{reportedUser.totalReports} laporan</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Terakhir: {formatDate(reportedUser.lastReportedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReports(reportedUser)}
                    disabled={loading}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(reportedUser.user.id)}>
                    Hapus User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Detail Laporan - {selectedUser?.user.fullname}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              {userReports.map((report) => (
                <Card key={report.reportId}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Dilaporkan oleh: {report.reporter.fullname}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</p>
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">Alasan:</p>
                        <p className="text-sm">{report.reason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {userReports.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Tidak ada detail laporan yang ditemukan</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
