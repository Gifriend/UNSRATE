import { io, type Socket } from "socket.io-client"

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

class WebSocketService {
  private socket: Socket | null = null
  private token: string | null = null
  private currentUrl = ""

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.token = getCookieValue("access_token")

      if (!this.token) {
        console.error("No access token found in cookies")
        reject(new Error("No access token found"))
        return
      }

      console.log("Token found:", this.token.substring(0, 20) + "...")

      // Sesuai screenshot: backend di port 5000
      const wsUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

      // Sesuai screenshot: /chat namespace
      this.currentUrl = `${wsUrl}chat`
      console.log("Connecting to WebSocket URL:", this.currentUrl)

      // Disconnect previous socket if exists
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }

      this.socket = io(this.currentUrl, {
        auth: {
          token: this.token, // Sesuai backend: client.handshake.auth?.token
        },
        transports: ["websocket", "polling"],
        forceNew: true,
        autoConnect: true,
        timeout: 20000,
        upgrade: true,
        rememberUpgrade: false,
      })

      this.socket.on("connect", () => {
        console.log("✅ Connected to WebSocket /chat namespace")
        console.log("Socket ID:", this.socket?.id)
        resolve(this.socket!)
      })

      this.socket.on("connect_error", (error) => {
        console.error("❌ WebSocket connection error:", error)
        console.error("Error details:", error.message)
        reject(error)
      })

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Disconnected from WebSocket:", reason)
      })

      this.socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error)
      })

      // Add debugging for all events
      this.socket.onAny((eventName, ...args) => {
        console.log(`📨 Received event: ${eventName}`, args)
      })
    })
  }

  // Join a match room - sesuai backend
  joinRoom(matchId: string) {
    if (this.socket && this.socket.connected) {
      console.log(`🚪 Joining room: ${matchId}`)

      // Sesuai backend: @MessageBody('matchId') - perlu object dengan key matchId
      const payload = { matchId }
      this.socket.emit("joinMatchRoom", payload)
      console.log("Join room payload sent:", payload)
    } else {
      console.error("❌ Socket not connected, cannot join room")
    }
  }

  // Leave a match room
  leaveRoom(matchId: string) {
    if (this.socket && this.socket.connected) {
      console.log(`🚪 Leaving room: ${matchId}`)

      const payload = { matchId }
      this.socket.emit("leaveMatchRoom", payload)
      console.log("Leave room payload sent:", payload)
    } else {
      console.error("❌ Socket not connected, cannot leave room")
    }
  }

  // Send a message - sesuai screenshot Postman
  sendMessage(matchId: string, content: string) {
    if (this.socket && this.socket.connected) {
      console.log(`📤 Sending message to room ${matchId}:`, content)

      // Sesuai screenshot: {"matchId": "cm4bvdyZdmfm1oyspGmvhgz", "content": "Hallo Nona Ganteng"}
      const messageData = {
        matchId,
        content,
      }

      console.log("📤 Message payload:", messageData)
      console.log("📤 Socket connected:", this.socket.connected)
      console.log("📤 Socket ID:", this.socket.id)

      // Sesuai screenshot: sendMessage event
      this.socket.emit("sendMessage", messageData)
      console.log("📤 Message emitted successfully")
    } else {
      console.error("❌ Socket not connected, cannot send message")
      console.error("Socket state:", {
        exists: !!this.socket,
        connected: this.socket?.connected,
        id: this.socket?.id,
      })
    }
  }

  // Listen for new messages - sesuai screenshot: newMessage event
  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      console.log("👂 Setting up message listener for 'newMessage'")
      this.socket.on("newMessage", (data) => {
        console.log("📨 Received newMessage:", data)
        callback(data)
      })
    }
  }

  // Listen for joined room confirmation
  onJoinedRoom(callback: (data: any) => void) {
    if (this.socket) {
      console.log("👂 Setting up joinedRoom listener")
      this.socket.on("joinedRoom", (data) => {
        console.log("📨 Received joinedRoom:", data)
        callback(data)
      })
    }
  }

  // Listen for left room confirmation
  onLeftRoom(callback: (data: any) => void) {
    if (this.socket) {
      console.log("👂 Setting up leftRoom listener")
      this.socket.on("leftRoom", (data) => {
        console.log("📨 Received leftRoom:", data)
        callback(data)
      })
    }
  }

  // Listen for errors
  onError(callback: (error: any) => void) {
    if (this.socket) {
      console.log("👂 Setting up error listener")
      this.socket.on("error", (error) => {
        console.log("📨 Received error:", error)
        callback(error)
      })
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      console.log("🧹 Removing all listeners")
      this.socket.removeAllListeners("newMessage")
      this.socket.removeAllListeners("joinedRoom")
      this.socket.removeAllListeners("leftRoom")
      this.socket.removeAllListeners("error")
      this.socket.offAny()
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting WebSocket")
      this.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Check connection status
  isConnected(): boolean {
    const connected = this.socket?.connected || false
    return connected
  }

  // Get socket info for debugging
  getSocketInfo() {
    return {
      exists: !!this.socket,
      connected: this.socket?.connected,
      id: this.socket?.id,
      hasToken: !!this.token,
      url: this.currentUrl,
    }
  }
}

export const wsService = new WebSocketService()
