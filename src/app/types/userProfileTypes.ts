export interface UserProfile {
  id: string
  fullname: string
  nim: string
  email: string
  profilePicture: string | null
  Photos: string[]
  bio: string 
  fakultas: string 
  prodi: string 
  age: number
  gender: string 
  alamat: string 
  verified: boolean
  interests:{ id: string; name: string }[];
  profileCompletion: number
  missingFields: string[]
}