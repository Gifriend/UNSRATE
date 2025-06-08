export interface MatchedUser {
  id: string
  fullname: string
  age: number
  gender: string
  fakultas: string
  prodi: string
  profilePicture: string
  bio: string
}

export interface LastMessage {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
}

export interface Match {
  id: string
  matchedUser: MatchedUser
  createdAt: string
  lastMessage: LastMessage | null
  unreadCount: number
}

export interface Pagination {
  currentPage: number
  limit: number
  totalPages: number
  totalMatches: number
}

export interface MatchListResponse {
  statusCode: number
  message: string
  matches: Match[]
  pagination: Pagination
}

export interface ChatMessage {
  id: string
  matchId: string
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
  sender: {
    id: string
    fullname: string
    profilePicture?: string
  }
}
