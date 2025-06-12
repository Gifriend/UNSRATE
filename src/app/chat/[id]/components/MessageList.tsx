"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Match } from "@/app/types/match"
import type { ChatMessage } from "@/app/types/chat"

interface MessageListProps {
  messages: ChatMessage[]
  matchInfo: Match
  isTyping: boolean
  onLikeMessage: (messageId: string) => void
  currentUserId: string
}

export default function MessageList({ messages, matchInfo, isTyping, onLikeMessage, currentUserId }: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hari ini"
    if (diffInDays === 1) return "Kemarin"
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`
    return date.toLocaleDateString("id-ID")
  }

  return (
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
          className={cn("flex group", message.senderId === currentUserId ? "justify-end" : "justify-start")}
        >
          {message.senderId !== currentUserId && (
            <Avatar className="h-8 w-8 mr-2 self-end">
              <AvatarImage
                src={message.sender?.profilePicture || matchInfo.matchedUser.profilePicture || "/placeholder.svg"}
              />
              <AvatarFallback>{message.sender?.fullname?.[0] || matchInfo.matchedUser.fullname[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="relative">
            <div
              className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl",
                message.senderId === currentUserId
                  ? "bg-pink-500 text-white rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none",
              )}
            >
              <p>{message.content}</p>
            </div>
            <div className="flex mt-1 text-xs text-muted-foreground items-center">
              <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              {message.senderId === currentUserId && message.isRead && <span className="ml-2">Seen</span>}
              {message.senderId !== currentUserId && (
                <button
                  className={cn("ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity")}
                  onClick={() => onLikeMessage(message.id)}
                >
                  <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <Avatar className="h-8 w-8 mr-2 self-end">
            <AvatarImage
              src={matchInfo.matchedUser.profilePicture || "/placeholder.svg" || "/placeholder.svg"}
              alt={matchInfo.matchedUser.fullname}
            />
            <AvatarFallback>{matchInfo.matchedUser.fullname[0]}</AvatarFallback>
          </Avatar>
          <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  )
}
