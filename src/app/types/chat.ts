export interface IncomingMessageDto {
  matchId: string
  content: string
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

export interface WebSocketMessage {
  event: string
  data: any
}
