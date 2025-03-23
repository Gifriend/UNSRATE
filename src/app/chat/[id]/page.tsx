"use client"

import { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Input } from "@/app/components/ui/input"
import { ArrowLeft, ChevronRight, ImageIcon, Paperclip, Send, Smile } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"

interface Message {
  id: number
  sender: "user" | "match"
  text: string
  timestamp: string
}

interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ChatPage({ params }: ChatPageProps) {
  // Unwrap the params promise using React's use function
  const { id: paramId } = use(params)
  const id = Number.parseInt(paramId)

  const [matchInfo, setMatchInfo] = useState({
    id: id,
    name: id === 1 ? "Mario" : id === 2 ? "Mikel" : "Clarissa",
    online: id === 1 || id === 3,
    image: ``,
  })

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "match", text: "Halo!", timestamp: "10:30" },
    { id: 2, sender: "user", text: "Hai, apa kabar?", timestamp: "10:31" },
    { id: 3, sender: "match", text: "Baik, kamu?", timestamp: "10:32" },
    { id: 4, sender: "user", text: "Baik juga! Apa yang sedang kamu lakukan?", timestamp: "10:33" },
    { id: 5, sender: "match", text: "Sedang belajar untuk ujian besok. Kamu?", timestamp: "10:35" },
    { id: 6, sender: "user", text: "Aku sedang santai saja. Mau ngobrol sebentar?", timestamp: "10:36" },
    { id: 7, sender: "match", text: "Boleh! Aku juga butuh istirahat sebentar dari belajar.", timestamp: "10:38" },
  ])

  const [newMessage, setNewMessage] = useState<string>("")
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/matches" className="mr-4">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>

            <div className="flex items-center flex-1">
              <div className="relative mr-3">
                <Avatar>
                  <AvatarImage src={matchInfo.image} alt={matchInfo.name} />
                  <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
                </Avatar>
                {matchInfo.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background"></span>
                )}
              </div>
              <div>
                <h2 className="font-medium">{matchInfo.name}</h2>
                <p className="text-xs text-muted-foreground">{matchInfo.online ? "Online" : "Offline"}</p>
              </div>
            </div>

            <Button size="icon" variant="ghost" className="h-8 w-8">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        <div className="container max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs px-4 py-2 rounded-2xl",
                  message.sender === "user"
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-background text-foreground rounded-bl-none shadow-sm",
                )}
              >
                <p>{message.text}</p>
                <p
                  className={cn(
                    "text-xs mt-1 text-right",
                    message.sender === "user" ? "text-pink-100" : "text-muted-foreground",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <div className="container max-w-md mx-auto flex items-end gap-2">
          <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-10 py-6 rounded-full"
              placeholder="Ketik pesan..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 rounded-full shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

