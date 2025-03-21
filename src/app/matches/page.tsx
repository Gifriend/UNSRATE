"use client"

import { useState } from "react"
import Link from "next/link"
import type { StaticImageData } from "next/image"
import Header from "@/app/components/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Search } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface Match {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  unread?: boolean
  online?: boolean
  image: (string | StaticImageData)[]
}

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const matches: Match[] = [
    {
      id: 1,
      name: "Mario",
      lastMessage: "Halo, apa kabar?",
      timestamp: "10:30",
      unread: true,
      online: true,
      image: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: 2,
      name: "Mikel",
      lastMessage: "Mau ngopi bareng?",
      timestamp: "Kemarin",
      online: false,
      image: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: 3,
      name: "Clarissa",
      lastMessage: "Terima kasih untuk hari ini!",
      timestamp: "Kemarin",
      unread: true,
      online: true,
      image: ["/placeholder.svg?height=100&width=100"],
    },
  ]

  const newMatches: Match[] = [
    {
      id: 4,
      name: "Anita",
      lastMessage: "",
      timestamp: "Baru",
      online: true,
      image: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: 5,
      name: "Budi",
      lastMessage: "",
      timestamp: "Baru",
      online: false,
      image: ["/placeholder.svg?height=100&width=100"],
    },
  ]

  const filteredMatches = matches.filter((match) => match.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="new">New Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-1">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Link href={`/chat/${match.id}`} key={match.id}>
                  <div
                    className={cn(
                      "flex items-center p-4 rounded-lg transition-colors",
                      match.unread ? "bg-muted/50" : "hover:bg-muted/30",
                    )}
                  >
                    <div className="relative mr-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={match.image[0] as string} alt={match.name} />
                        <AvatarFallback>{match.name[0]}</AvatarFallback>
                      </Avatar>
                      {match.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{match.name}</h3>
                        <span
                          className={cn(
                            "text-xs",
                            match.unread ? "text-pink-500 font-medium" : "text-muted-foreground",
                          )}
                        >
                          {match.timestamp}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm truncate",
                          match.unread ? "text-foreground font-medium" : "text-muted-foreground",
                        )}
                      >
                        {match.lastMessage}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No messages found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-1">
            {newMatches.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {newMatches.map((match) => (
                  <Link href={`/chat/${match.id}`} key={match.id}>
                    <div className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/30 transition-colors text-center">
                      <div className="relative mb-3">
                        <Avatar className="h-16 w-16 border">
                          <AvatarImage src={match.image[0] as string} alt={match.name} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        {match.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                        )}
                      </div>
                      <h3 className="font-medium">{match.name}</h3>
                      <span className="text-xs text-pink-500">{match.timestamp}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No new matches</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}