import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardsProps {
  stats: {
    totalUsers: number
    verifiedUsers: number
    verificationRate: number
  } | null
  pendingUsersCount: number
  reportedUsersCount: number
  totalReportsCount: number
}

export const StatCards = ({ stats, pendingUsersCount, reportedUsersCount, totalReportsCount }: StatCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground">{pendingUsersCount} menunggu verifikasi</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.verifiedUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.verificationRate ? `${(stats.verificationRate * 100).toFixed(0)}%` : "0%"} dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pengguna Dilaporkan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportedUsersCount}</div>
          <p className="text-xs text-muted-foreground">pengguna dengan laporan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReportsCount}</div>
          <p className="text-xs text-muted-foreground">laporan masuk</p>
        </CardContent>
      </Card>
    </div>
  )
}
