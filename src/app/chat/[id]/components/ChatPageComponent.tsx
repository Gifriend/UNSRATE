"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import ChatHeader from "./ChatHeader"
import ChatSidebar from "./ChatSidebar"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import ReportDialog from "./ReportDialog"
import { wsService } from "@/app/services/websocket"
import { chatApi, matchApi } from "@/app/services/api"
import type { Match } from "@/app/types/match"
import type { ChatMessage } from "@/app/types/chat"

// Helper function to get user ID from JWT token in cookie
const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null

  const getCookieValue = (name: string): string | null => {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim())
      if (cookieName === name) {
        return cookieValue
      }
    }
    return null
  }

  const token = getCookieValue("access_token")
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || payload.id || null
  } catch (error) {
    console.error("Error parsing token:", error)
    return null
  }
}

export default function ChatPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const [matchInfo, setMatchInfo] = useState<Match | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isReporting, setIsReporting] = useState(false)

  // Get user ID from token
  useEffect(() => {
    const userIdFromToken = getUserIdFromToken()
    if (userIdFromToken) {
      setUserId(userIdFromToken)
    } else {
      setError("No user ID found in token")
    }
  }, [])

  // Fetch match info
  useEffect(() => {
    const fetchMatchInfo = async () => {
      if (!id) return

      try {
        setLoading(true)
        console.log("Fetching match info for ID:", id)

        const response = await matchApi.getMatchById(id)
        console.log("API Response:", response)

        let matchData = null
        if (response.data?.match) {
          matchData = response.data.match
        } else if (response.data?.data) {
          matchData = response.data.data
        } else if (response.data) {
          matchData = response.data
        }

        if (matchData && matchData.matchedUser) {
          setMatchInfo(matchData)
          setError(null)
        } else {
          setError("Match data not found in API response")
        }
      } catch (error) {
        console.error("Failed to fetch match info:", error)
        setError("Failed to load match information")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchInfo()
  }, [id])

  // Fetch message history
  useEffect(() => {
    const fetchMessageHistory = async () => {
      if (!userId || !id) return

      try {
        const response = await chatApi.getMessages(id)

        if (Array.isArray(response.data)) {
          setMessages(response.data) // Use the ChatMessage objects directly
        }
      } catch (error) {
        console.error("Failed to fetch message history:", error)
      }
    }

    fetchMessageHistory()
  }, [id, userId])

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId || !id) return

    let retryCount = 0
    const maxRetries = 3

    const connectWithRetry = async () => {
      try {
        await initializeWebSocket()
      } catch (error) {
        console.log(error)
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(connectWithRetry, 2000 * retryCount)
        }
      }
    }

    connectWithRetry()

    return () => {
      if (id) {
        wsService.leaveRoom(id)
      }
      wsService.disconnect()
      setIsConnected(false)
    }
  }, [id, userId])

  const initializeWebSocket = async () => {
    try {
      await wsService.connect()
      setIsConnected(true)

      setTimeout(() => {
        wsService.joinRoom(id)
      }, 1000)

      wsService.onMessage((messageData) => {
        const newMsg: ChatMessage = {
          id: messageData.id || Date.now().toString(),
          matchId: id,
          senderId: messageData.senderId,
          content: messageData.content || messageData.message || messageData.text || "",
          createdAt: messageData.createdAt || new Date().toISOString(),
          isRead: messageData.senderId === userId,
          sender: messageData.sender || {
            id: messageData.senderId,
            fullname: messageData.senderId === userId ? "You" : matchInfo?.matchedUser?.fullname || "Unknown",
            profilePicture: messageData.senderId === userId ? "" : matchInfo?.matchedUser?.profilePicture,
          },
        }

        if (messageData.senderId === userId) {
          setMessages((prev) => {
            const filtered = prev.filter((msg) => !msg.id.startsWith("temp-"))
            return [...filtered, newMsg]
          })
        } else {
          setMessages((prev) => [...prev, newMsg])
        }
      })

      wsService.onError((error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      })
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setIsConnected(false)
    }
  }

  const handleSendMessage = (message: string) => {
    if (!wsService.isConnected()) return

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      matchId: id,
      senderId: userId,
      content: message,
      createdAt: new Date().toISOString(),
      isRead: false,
      sender: {
        id: userId,
        fullname: "You",
      },
    }

    setMessages((prev) => [...prev, tempMessage])
    wsService.sendMessage(id, message)
  }

  const handleLikeMessage = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, } : msg)))
  }

  const handleReport = () => {
    setIsReportDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading match data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Link href="/matches">
                <Button variant="outline">Back to Matches</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!matchInfo || !matchInfo.matchedUser) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">Match not found</p>
            <Link href="/matches">
              <Button>Back to Matches</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full md:px-0">
          <div className="md:grid md:grid-cols-12 md:gap-6 h-full">
            <ChatSidebar matchInfo={matchInfo} onReport={handleReport} isReporting={isReporting} />

            <div className="md:col-span-9 lg:col-span-9 flex flex-col h-[calc(100vh-10rem)]">
              <ChatHeader matchInfo={matchInfo} isConnected={isConnected} onReport={handleReport} />

              <MessageList
                messages={messages}
                matchInfo={matchInfo}
                isTyping={isTyping}
                onLikeMessage={handleLikeMessage}
                currentUserId={userId}
              />

              <MessageInput onSendMessage={handleSendMessage} isConnected={isConnected} />
            </div>
          </div>
        </div>
      </div>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        userName={matchInfo.matchedUser.fullname}
        userId={matchInfo.matchedUser.id}
      />
    </div>
  )
}
