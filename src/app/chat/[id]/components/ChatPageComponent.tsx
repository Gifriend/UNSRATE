"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Heart, Info, MoreHorizontal, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { wsService } from "@/app/services/websocket"
import { chatApi, matchApi } from "@/app/services/api"
import type { Match } from "@/app/types/match"

interface Message {
  id: string
  sender: "user" | "match"
  text: string
  timestamp: string
  seen?: boolean
  liked?: boolean
}

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

export default function ChatPageComponent({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const [matchInfo, setMatchInfo] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [isTyping] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleReport = () => {
    alert("Anda berhasil melaporkan orang ini")
  }

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

        // Parse the correct structure: response.data.match
        let matchData = null

        if (response.data?.match) {
          // API returns {statusCode, message, match: {...}}
          matchData = response.data.match
          console.log("Found match data in response.data.match:", matchData)
        } else if (response.data?.data) {
          // Nested data structure
          matchData = response.data.data
        } else if (response.data) {
          // Direct data structure
          matchData = response.data
        }

        if (matchData && matchData.matchedUser) {
          setMatchInfo(matchData)
          setError(null)
          console.log("Match info set successfully:", matchData)
        } else {
          console.error("No valid match data found in response")
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
        console.log("Fetching message history for match:", id)
        const response = await chatApi.getMessages(id)
        console.log("Message history response:", response)

        if (Array.isArray(response.data)) {
          const fetchedMessages = response.data.map((msg) => {
            return {
              id: msg.id,
              sender: msg.senderId === userId ? "user" : ("match" as "user" | "match"),
              text: msg.content || "",
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              seen: msg.isRead || msg.senderId === userId,
            }
          })
          setMessages(fetchedMessages)
          console.log("Messages processed:", fetchedMessages)
        } else {
          console.error("Unexpected message history format:", response.data)
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
        console.log(error);
        retryCount++
        if (retryCount < maxRetries) {
          console.log(`Retrying connection... (${retryCount}/${maxRetries})`)
          setTimeout(connectWithRetry, 2000 * retryCount)
        } else {
          console.error("Max retries reached. Connection failed.")
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
  }, [id, userId,])

  const initializeWebSocket = async () => {
    try {
      console.log("Attempting to connect to WebSocket...")

      await wsService.connect()
      setIsConnected(true)
      console.log("WebSocket connected successfully")

      setTimeout(() => {
        wsService.joinRoom(id)
      }, 1000)

      wsService.onMessage((messageData) => {
        console.log("Raw message received:", messageData)
        console.log("Message data keys:", Object.keys(messageData))
        console.log("Message content:", messageData.content || messageData.message || messageData.text)

        const messageSender: "user" | "match" = messageData.senderId === userId ? "user" : "match"

        const timestamp = new Date(messageData.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })

        const newMsg: Message = {
          id: messageData.id || Date.now().toString(),
          sender: messageSender,
          text: messageData.content || messageData.message || messageData.text || "",
          timestamp,
          seen: messageSender === "user" ? true : false,
        }

        console.log("Processed message:", newMsg)

        // Remove temp message if this is confirmation of sent message
        if (messageSender === "user") {
          setMessages((prev) => {
            const filtered = prev.filter((msg) => !msg.id.startsWith("temp-"))
            return [...filtered, newMsg]
          })
        } else {
          setMessages((prev) => [...prev, newMsg])
        }
      })

      wsService.onJoinedRoom((data) => {
        console.log("Successfully joined room:", data)
      })

      wsService.onLeftRoom((data) => {
        console.log("Successfully left room:", data)
      })

      wsService.onError((error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      })

      wsService.onMessage((data) => {
        console.log("Message sent acknowledgment:", data)
      })
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setIsConnected(false)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !wsService.isConnected()) return

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    }

    // Add message optimistically to UI
    setMessages((prev) => [...prev, tempMessage])

    // Send to server
    wsService.sendMessage(id, newMessage.trim())
    setNewMessage("")
  }

  const handleLikeMessage = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, liked: !msg.liked } : msg)))
  }

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hari ini"
    if (diffInDays === 1) return "Kemarin"
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`
    return date.toLocaleDateString("id-ID")
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
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full md:px-0">
          <div className="md:grid md:grid-cols-12 md:gap-6 h-full">
            {/* Left sidebar for desktop */}
            <div className="hidden md:block md:col-span-3 lg:col-span-3">
              <Card className="sticky top-4">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Link href={`/profile/${matchInfo.matchedUser.id}`} className="group relative">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-transparent group-hover:ring-pink-500 transition-all">
                      <AvatarImage
                        src={matchInfo.matchedUser.profilePicture || "/placeholder.svg"}
                        alt={matchInfo.matchedUser.fullname}
                      />
                      <AvatarFallback className="text-2xl">{matchInfo.matchedUser.fullname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-pink-500 hover:bg-pink-600">View</Badge>
                    </div>
                  </Link>
                  <h2 className="text-xl font-bold mb-1">
                    {matchInfo.matchedUser.fullname}, {matchInfo.matchedUser.age}
                  </h2>

                  <div className="w-full space-y-4 mt-4 text-left">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Match
                      </h3>
                      <p className="text-sm">{formatMatchDate(matchInfo.createdAt)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1" /> Pendidikan
                      </h3>
                      <p className="text-sm">{matchInfo.matchedUser.fakultas}</p>
                      <p className="text-xs text-muted-foreground">{matchInfo.matchedUser.prodi}</p>
                    </div>

                    {matchInfo.matchedUser.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                          <User className="h-4 w-4 mr-1" /> Bio
                        </h3>
                        <p className="text-sm">{matchInfo.matchedUser.bio}</p>
                      </div>
                    )}

                    <div className="w-full space-y-2 mt-4">
                      <Link href={`/profile/${matchInfo.matchedUser.id}`}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" /> View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={handleReport}
                      >
                        <Info className="h-4 w-4 mr-2" /> Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat area */}
            <div className="md:col-span-9 lg:col-span-9 flex flex-col h-[calc(100vh-10rem)]">
              <div className="border-b mb-4 pb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/matches" className="mr-4 md:hidden">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href={`/profile/${matchInfo.matchedUser.id}`} className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={matchInfo.matchedUser.profilePicture || "/placeholder.svg"}
                        alt={matchInfo.matchedUser.fullname}
                      />
                      <AvatarFallback>{matchInfo.matchedUser.fullname[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{matchInfo.matchedUser.fullname}</h2>

                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      isConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                    )}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/profile/${matchInfo.matchedUser.id}`}>
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={handleReport}>
                        <Info className="h-4 w-4 mr-2" /> Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
                <div className="p-4 rounded-lg bg-white shadow-sm mb-4 text-center border border-pink-100">
                  <p className="text-sm text-muted-foreground">
                    Anda dan {matchInfo.matchedUser.fullname} telah match {formatMatchDate(matchInfo.createdAt)}
                  </p>
                  <p className="text-sm font-medium mt-1">Mulai percakapan yang menarik!</p>
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Belum ada pesan. Mulai percakapan!</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex group", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.sender === "match" && (
                      <Avatar className="h-8 w-8 mr-2 self-end">
                        <AvatarImage
                          src={matchInfo.matchedUser.profilePicture || "/placeholder.svg"}
                          alt={matchInfo.matchedUser.fullname}
                        />
                        <AvatarFallback>{matchInfo.matchedUser.fullname[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="relative">
                      <div
                        className={cn(
                          "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl",
                          message.sender === "user"
                            ? "bg-pink-500 text-white rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none",
                        )}
                      >
                        <p>{message.text}</p>
                      </div>
                      <div className="flex mt-1 text-xs text-muted-foreground items-center">
                        <span>{message.timestamp}</span>
                        {message.sender === "user" && message.seen && <span className="ml-2">Seen</span>}

                        {/* Like button for messages */}
                        {message.sender === "match" && (
                          <button
                            className={cn(
                              "ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity",
                              message.liked && "opacity-100",
                            )}
                            onClick={() => handleLikeMessage(message.id)}
                          >
                            <Heart
                              className={cn(
                                "h-3.5 w-3.5",
                                message.liked ? "fill-pink-500 text-pink-500" : "text-muted-foreground",
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 self-end">
                      <AvatarImage
                        src={matchInfo.matchedUser.profilePicture || "/placeholder.svg"}
                        alt={matchInfo.matchedUser.fullname}
                      />
                      <AvatarFallback>{matchInfo.matchedUser.fullname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div
                          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={endOfMessagesRef} />
              </div>

              {/* Message input */}
              <div className="border-t pt-4">
                <div className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="pr-10 py-6 rounded-full"
                      placeholder="Ketik pesan..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={!isConnected}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-10 w-10 rounded-full shrink-0 bg-pink-500 hover:bg-pink-600"
                    disabled={!isConnected || !newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
