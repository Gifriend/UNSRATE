export interface UserProfile {
  id: string
  fullname: string
  nim: string
  email: string
  profilePicture: string | null
  Photos: {id: string, url: string}[]
  bio: string | null
  fakultas: string | null
  prodi: string | null
  age: number
  gender: string | null
  alamat: string | null
  verified: boolean
  interests: string[]
  profileCompletion: number
  missingFields: string[]
}