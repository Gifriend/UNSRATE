"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import type { StaticImageData } from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Heart,
  ImageIcon,
  Info,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  User,
} from "lucide-react"
import { cn } from "@/app/lib/utils"

// Import gambar
import mikel from "@/app/assets/img/mikel.png"
import clarissa from "@/app/assets/img/clarissa.jpg"
import mario from "@/app/assets/img/mario.jpg"
import Header from "@/app/components/Header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

interface Message {
  id: number
  sender: "user" | "match"
  text: string
  timestamp: string
  seen?: boolean
}

interface MatchInfo {
  id: number
  name: string
  age: number
  online: boolean
  location: string
  education: string
  interests: string[]
  image: StaticImageData
  matchDate: string
}

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const id = Number.parseInt(params.id)

  // Data match berdasarkan ID
  const matchesData: Record<number, MatchInfo> = {
    1: {
      id: 1,
      name: "Mario",
      age: 18,
      online: true,
      location: "Manado, Sulawesi Utara",
      education: "Computer Science Student",
      interests: ["AI", "Mathematics", "Programming", "Chess"],
      image: mario,
      matchDate: "2 hari yang lalu",
    },
    2: {
      id: 2,
      name: "Mikel",
      age: 21,
      online: false,
      location: "Jakarta",
      education: "Music Production",
      interests: ["Coffee", "Music", "Writing", "Guitar"],
      image: mikel,
      matchDate: "1 minggu yang lalu",
    },
    3: {
      id: 3,
      name: "Clarissa",
      age: 20,
      online: true,
      location: "Bandung",
      education: "Culinary Arts",
      interests: ["Food", "Movies", "Travel", "Photography"],
      image: clarissa,
      matchDate: "3 hari yang lalu",
    },
    4: {
      id: 4,
      name: "Clarissa",
      age: 20,
      online: true,
      location: "Bandung",
      education: "Culinary Arts",
      interests: ["Food", "Movies", "Travel", "Photography"],
      image: clarissa,
      matchDate: "Hari ini",
    },
    5: {
      id: 5,
      name: "Mikel",
      age: 21,
      online: false,
      location: "Jakarta",
      education: "Music Production",
      interests: ["Coffee", "Music", "Writing", "Guitar"],
      image: mikel,
      matchDate: "Hari ini",
    },
  }

  // Ambil data match berdasarkan ID, atau gunakan default jika tidak ditemukan
  const matchInfo = matchesData[id] || matchesData[1]

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "match", text: "Halo!", timestamp: "10:30", seen: true },
    { id: 2, sender: "user", text: "Hai, apa kabar?", timestamp: "10:31", seen: true },
    { id: 3, sender: "match", text: "Baik, kamu?", timestamp: "10:32", seen: true },
    { id: 4, sender: "user", text: "Baik juga! Apa yang sedang kamu lakukan?", timestamp: "10:33", seen: true },
    { id: 5, sender: "match", text: "Sedang belajar untuk ujian besok. Kamu?", timestamp: "10:35", seen: true },
    { id: 6, sender: "user", text: "Aku sedang santai saja. Mau ngobrol sebentar?", timestamp: "10:36", seen: true },
    {
      id: 7,
      sender: "match",
      text: "Boleh! Aku juga butuh istirahat sebentar dari belajar.",
      timestamp: "10:38",
      seen: true,
    },
  ])

  const [newMessage, setNewMessage] = useState<string>("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleReport = () => {
    alert("Anda berhasil melaporkan orang ini")
  }

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      const timer = setTimeout(() => {
        setIsTyping(true)

        const typingTimer = setTimeout(() => {
          setIsTyping(false)

          // Add a response after typing
          if (Math.random() > 0.5) {
            const responses = [
              "Oke, boleh banget!",
              "Hmm, menarik...",
              "Iya, aku setuju",
              "Wah, keren!",
              "Besok kita ketemu ya?",
            ]

            const newMsg: Message = {
              id: messages.length + 1,
              sender: "match",
              text: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              seen: true,
            }

            setMessages((prev) => [...prev, newMsg])
          }
        }, 2000)

        return () => clearTimeout(typingTimer)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
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
                  <Link href={`/profile/${matchInfo.id}`} className="group">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-transparent group-hover:ring-pink-500 transition-all">
                      <AvatarImage src={matchInfo.image.src} alt={matchInfo.name} />
                      <AvatarFallback className="text-2xl">{matchInfo.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-pink-500 hover:bg-pink-600">View</Badge>
                    </div>
                  </Link>
                  <h2 className="text-xl font-bold mb-1">
                    {matchInfo.name}, {matchInfo.age}
                  </h2>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <span
                      className={cn("h-2 w-2 rounded-full", matchInfo.online ? "bg-emerald-500" : "bg-gray-300")}
                    ></span>
                    <span>{matchInfo.online ? "Online" : "Offline"}</span>
                  </div>

                  <div className="w-full space-y-4 mt-4 text-left">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> Lokasi
                      </h3>
                      <p className="text-sm">{matchInfo.location}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Match
                      </h3>
                      <p className="text-sm">{matchInfo.matchDate}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-1" /> Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchInfo.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="w-full space-y-2 mt-4">
                      <Link href={`/profile/${matchInfo.id}`}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" /> View Profile
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={handleReport}>
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

                  <Link href={`/profile/${matchInfo.id}`} className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={matchInfo.image.src} alt={matchInfo.name} />
                      <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{matchInfo.name}</h2>
                      <p className="text-xs text-muted-foreground">{matchInfo.online ? "Online" : "Offline"}</p>
                    </div>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <Link href={`/profile/${matchInfo.id}`}>
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
                <div className="p-4 rounded-lg bg-white shadow-sm mb-4 text-center border border-pink-100">
                  <p className="text-sm text-muted-foreground">
                    Anda dan {matchInfo.name} telah match {matchInfo.matchDate}
                  </p>
                  <p className="text-sm font-medium mt-1">Mulai percakapan yang menarik!</p>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex group", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.sender === "match" && (
                      <Avatar className="h-8 w-8 mr-2 self-end">
                        <AvatarImage src={matchInfo.image.src} alt={matchInfo.name} />
                        <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
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
                        {/* {message.sender === "match" && (
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
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 self-end">
                      <AvatarImage src={matchInfo.image.src} alt={matchInfo.name} />
                      <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
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
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-10 w-10 rounded-full shrink-0 bg-pink-500 hover:bg-pink-600"
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
