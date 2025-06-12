import { api } from "./api"

export interface Interest {
  id: string
  name: string
}

export const interestsApi = {
  // Get all available interests
  async getAllInterests(): Promise<Interest[]> {
    console.log("Calling API: GET /interests")
    const response = await api.get("interests")
    console.log("Interests API response:", response)
    return response.data || []
  },

  // Update user interests (uses existing users/profile endpoint)
  async updateUserInterests(interestIds: string[]) {
    console.log("Calling API: PATCH /users/profile with setInterests:", interestIds)
    const response = await api.patch("users/profile", {
      setInterests: interestIds,
    })
    console.log("Update interests API response:", response)
    return response.data
  },

  // Add interests to user (uses existing users/profile endpoint)
  async addUserInterests(interestIds: string[]) {
    console.log("Calling API: PATCH /users/profile with addInterests:", interestIds)
    const response = await api.patch("users/profile", {
      addInterests: interestIds,
    })
    console.log("Add interests API response:", response)
    return response.data
  },

  // Remove interests from user (uses existing users/profile endpoint)
  async removeUserInterests(interestIds: string[]) {
    console.log("Calling API: PATCH /users/profile with removeInterests:", interestIds)
    const response = await api.patch("users/profile", {
      removeInterests: interestIds,
    })
    console.log("Remove interests API response:", response)
    return response.data
  },
}
