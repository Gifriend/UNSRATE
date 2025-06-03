export interface Interest {
  id: string
  name: string
}

export interface DiscoveryProfile {
  id: string
  fullname: string
  age: number
  gender: "MALE" | "FEMALE" 
  fakultas?: string
  prodi?: string
  bio?: string
  profilePicture?: string
  Photos: string[]
  interests: Interest[]
  matchScore: number
}

export interface DiscoveryResponse {
  statusCode: number
  message: string
  profiles: DiscoveryProfile[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DiscoveryFilters {
  gender?: "MALE" | "FEMALE" | "OTHER"
  minAge?: number
  maxAge?: number
  fakultas?: string
  prodi?: string
  limit?: number
  sharedInterestsOnly?: boolean
}
