import { api } from "./api"

export interface ReportedUser {
  user: {
    id: string
    fullname: string
    nim: string
    profilePicture?: string
  }
  totalReports: number
  lastReportedAt: string
}

export interface UserReport {
  reportId: string
  reason: string
  createdAt: string
  reporter: {
    id: string
    fullname: string
  }
}

export const reportApi = {
  // Get all reported users (Admin only)
  async getReportedUsers(): Promise<ReportedUser[]> {
    console.log("Calling API: GET /report/admin")
    const response = await api.get("report/admin")
    console.log("Reported users API response:", response)
    return response.data.data || []
  },

  // Get detailed reports for a specific user (Admin only)
  async getReportsForUser(userId: string): Promise<UserReport[]> {
    console.log(`Calling API: GET /report/admin/${userId}`)
    const response = await api.get(`report/admin/${userId}`)
    console.log(`Reports for user ${userId} API response:`, response)
    return response.data.data || []
  },

  // Create a new report (User)
  async createReport(reportedUserId: string, reason: string) {
    console.log(`Calling API: POST /report/users/${reportedUserId}`)
    const response = await api.post(`report/users/${reportedUserId}`, { reason })
    console.log(`Create report API response:`, response)
    return response.data
  },
}
