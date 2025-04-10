"use client"

import { useState } from "react"
import Link from "next/link"
import type { StaticImageData } from "next/image"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Search, MessageCircle } from "lucide-react"
import { cn } from "@/app/lib/utils"

// Import gambar
import mikel from "@/app/assets/img/mikel.png"
import clarissa from "@/app/assets/img/clarissa.jpg"
import mario from "@/app/assets/img/mario.jpg"
import Header from "@/app/components/Header"

interface Match {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  unread?: boolean
  online?: boolean
  image: StaticImageData
  seen?: boolean
}

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const matches: Match[] = [
    {
      id: 1,
      name: "Mario",
      lastMessage: "Halo, apa kabar?",
      timestamp: "10:30",
      unread: true,
      online: true,
      image: mario,
    },
    {
      id: 2,
      name: "Mikel",
      lastMessage: "Mau ngopi bareng?",
      timestamp: "Kemarin",
      online: false,
      image: mikel,
      seen: true,
    },
    {
      id: 3,
      name: "Clarissa",
      lastMessage: "Terima kasih untuk hari ini!",
      timestamp: "Kemarin",
      unread: true,
      online: true,
      image: clarissa,
    },
    {
      id: 4,
      name: "Clarissa",
      lastMessage: "Baru match!",
      timestamp: "3j",
      online: true,
      image: clarissa,
      seen: true,
    },
    {
      id: 5,
      name: "Mikel",
      lastMessage: "Baru match!",
      timestamp: "5j",
      online: false,
      image: mikel,
      seen: true,
    },
  ]

  const filteredMatches = matches.filter(
    (match) =>
      match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 md:px-0">
        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Left panel - Matches list */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages@/app."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <div key={match.id} onClick={() => handleMatchClick(match)} className="cursor-pointer">
                    <Link href={`/chat/${match.id}`} className="block md:hidden">
                      <MatchItem match={match} />
                    </Link>
                    <div className="hidden md:block" onClick={() => handleMatchClick(match)}>
                      <MatchItem match={match} isSelected={selectedMatch?.id === match.id} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Chat preview or "Chat Now" message */}
          <div className="hidden md:block md:col-span-8 lg:col-span-9">
            {selectedMatch ? (
              <div className="border rounded-lg h-[calc(100vh-12rem)] flex flex-col">
                <div className="border-b p-4 flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedMatch.image.src} alt={selectedMatch.name} />
                    <AvatarFallback>{selectedMatch.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{selectedMatch.name}</h2>
                    <p className="text-xs text-muted-foreground">{selectedMatch.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex-1 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Continue your conversation with {selectedMatch.name}</p>
                    <Link href={`/chat/${selectedMatch.id}`}>
                      <Button>Open Full Chat</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg h-[calc(100vh-12rem)] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Your Messages</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Select a chat from the left to start messaging or find new matches to connect with.
                  </p>
                  <Link href="/swipe">
                    <Button>Find Matches</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Match item component for reuse
function MatchItem({ match, isSelected }: { match: Match; isSelected?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-lg transition-colors",
        isSelected ? "bg-muted" : match.unread ? "bg-muted/50" : "hover:bg-muted/30",
      )}
    >
      <div className="relative mr-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={match.image.src} alt={match.name} />
          <AvatarFallback>{match.name[0]}</AvatarFallback>
        </Avatar>
        {match.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{match.name}</h3>
          <span className={cn("text-xs", match.unread ? "text-pink-500 font-medium" : "text-muted-foreground")}>
            {match.timestamp}
          </span>
        </div>
        <p className={cn("text-sm truncate", match.unread ? "text-foreground font-medium" : "text-muted-foreground")}>
          {match.lastMessage}
        </p>
      </div>
    </div>
  )
}
