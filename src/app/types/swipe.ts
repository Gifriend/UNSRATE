export interface Profile {
  id: string
  name: string
  fullname: string
  age: number
  bio: string
  Photos: string[]
  profilePicture?: string 
  gender?: "MALE" | "FEMALE" 
  fakultas?: string
  prodi?: string
  interests?: Array<{ id: string; name: string }>
  matchScore?: number
}

export interface SwipeResponse {
  statusCode: number
  message: string
  swipe: {
    id: string
    swiperUserId: string
    swipedUserId: string
    action: "LIKE" | "DISLIKE"
    createdAt: string
  }
  match?: {
    id: string
    userAId: string
    userBId: string
    createdAt: string
  }
}

export interface SwipeRequest {
  swipedUserId: string
  action: "LIKE" | "DISLIKE"
}
