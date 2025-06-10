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

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.token = getCookieValue("access_token")

      if (!this.token) {
        reject(new Error("No access token found"))
        return
      }

      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

      // Try connecting without namespace first, then with namespace
      this.socket = io(wsUrl, {
        auth: {
          token: this.token,
        },
        transports: ["websocket", "polling"],
        forceNew: true,
        autoConnect: true,
        timeout: 20000,
      })

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server")

        // After successful connection, try to join the chat namespace
        if (this.socket) {
          this.socket.emit("joinChatNamespace")
        }

        resolve(this.socket!)
      })

      this.socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error)

        // If namespace fails, try connecting to root namespace
        if (error.message.includes("Invalid namespace")) {
          console.log("Trying to connect to root namespace...")
          this.connectToRoot().then(resolve).catch(reject)
        } else {
          reject(error)
        }
      })

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket:", reason)
      })

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error)
      })
    })
  }

  // Fallback method to connect to root namespace
  private connectToRoot(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.disconnect()
      }

      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

      this.socket = io(wsUrl, {
        auth: {
          token: this.token,
        },
        transports: ["websocket", "polling"],
        forceNew: true,
        autoConnect: true,
      })

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket root namespace")
        resolve(this.socket!)
      })

      this.socket.on("connect_error", (error) => {
        console.error("Root namespace connection error:", error)
        reject(error)
      })
    })
  }

  // Join a match room
  joinRoom(matchId: string) {
    if (this.socket && this.socket.connected) {
      console.log(`Joining room: ${matchId}`)
      // Try both possible event names
      this.socket.emit("joinMatchRoom", { matchId })
      this.socket.emit("join", { room: matchId })
      this.socket.emit("joinRoom", { matchId })
    }
  }

  // Leave a match room
  leaveRoom(matchId: string) {
    if (this.socket && this.socket.connected) {
      console.log(`Leaving room: ${matchId}`)
      this.socket.emit("leaveMatchRoom", { matchId })
    }
  }

  // Send a message
  sendMessage(matchId: string, content: string) {
    if (this.socket && this.socket.connected) {
      console.log(`Sending message to room ${matchId}:`, content)

      // Try multiple event formats and log each attempt
      const messageData = { matchId, content }

      console.log("Trying 'sendMessage' event:", messageData)
      this.socket.emit("sendMessage", messageData)

      console.log("Trying 'message' event:", messageData)
      this.socket.emit("message", messageData)

      console.log("Trying 'send' event:", messageData)
      this.socket.emit("send", messageData)

      // Also try with different data structures
      console.log("Trying with room-based structure:")
      this.socket.emit("sendMessage", { room: matchId, content })
      this.socket.emit("message", { room: matchId, content })
    } else {
      console.error("Socket not connected, cannot send message")
    }
  }

  // Listen for new messages
  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("newMessage", callback)
      this.socket.on("message", callback)
      this.socket.on("messageReceived", callback)
    }
  }

  // Listen for joined room confirmation
  onJoinedRoom(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("joinedRoom", callback)
      this.socket.on("joined", callback)
      this.socket.on("roomJoined", callback)
    }
  }

  // Listen for left room confirmation
  onLeftRoom(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("leftRoom", callback)
    }
  }

  // Listen for errors
  onError(callback: (error: any) => void) {
    if (this.socket) {
      this.socket.on("error", callback)
    }
  }

  // Listen for message acknowledgments
  onMessageSent(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("messageSent", callback)
      this.socket.on("messageDelivered", callback)
      this.socket.on("sent", callback)
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners("newMessage")
      this.socket.removeAllListeners("joinedRoom")
      this.socket.removeAllListeners("leftRoom")
      this.socket.removeAllListeners("error")
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const wsService = new WebSocketService()
