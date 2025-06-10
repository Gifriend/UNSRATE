import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getCookieValue("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const getCookieValue = (name: string): string | null => {
  if (typeof window === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim())
    if (cookieName === name) {
      return cookieValue
    }
  }
  return null
}

// Chat API endpoints
export const chatApi = {
  getMessages: (matchId: string) => {
    console.log(`Calling API: GET /chat/match/${matchId}/messages`)
    return api
      .get(`chat/match/${matchId}/messages`)
      .then((response) => {
        console.log("Messages API response:", response)
        return response
      })
      .catch((error) => {
        console.error("Messages API error:", error)
        throw error
      })
  },
}

// Match API endpoints
export const matchApi = {
  getMatches: (params: any) => {
    console.log("Calling API: GET /matches with params:", params)
    return api
      .get("matches", { params })
      .then((response) => {
        console.log("Matches API response:", response)
        return response
      })
      .catch((error) => {
        console.error("Matches API error:", error)
        throw error
      })
  },

  getMatchById: (matchId: string) => {
    console.log(`Calling API: GET /matches/${matchId}`)
    return api
      .get(`matches/${matchId}`)
      .then((response) => {
        console.log(`Match ${matchId} API response:`, response)
        return response
      })
      .catch((error) => {
        console.error(`Match ${matchId} API error:`, error)
        throw error
      })
  },

  deleteMatch: (matchId: string) => {
    console.log(`Calling API: DELETE /matches/${matchId}`)
    return api
      .delete(`matches/${matchId}`)
      .then((response) => {
        console.log(`Delete match ${matchId} API response:`, response)
        return response
      })
      .catch((error) => {
        console.error(`Delete match ${matchId} API error:`, error)
        throw error
      })
  },
}
