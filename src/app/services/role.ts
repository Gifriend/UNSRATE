export const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.role || null
  } catch (error) {
    console.error("Error parsing JWT token:", error)
    return null
  }
}