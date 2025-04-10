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
    <div className="min-h-screen bg-background border-x border-gray-200 max-w-screen-xl mx-auto">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="relative mb-6 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9 border-gray-300 focus:border-pink-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full max-w-full grid-cols-2 mb-6 border border-gray-200 p-1 rounded-lg">
            <TabsTrigger value="messages" className="border-r data-[state=active]:border-pink-500 data-[state=active]:text-pink-500">Messages</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:border-pink-500 data-[state=active]:text-pink-500">New Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <Link href={`/chat/${match.id}`} key={match.id}>
                    <div
                      className={cn(
                        "flex items-center p-4 rounded-lg transition-colors h-full border",
                        match.unread 
                          ? "bg-muted/50 border-pink-200" 
                          : "hover:bg-muted/30 border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <div className="relative mr-4">
                        <Avatar className="h-12 w-12 border-2 border-gray-200">
                          <AvatarImage src={match.image[0] as string} alt={match.name} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        {match.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline border-b border-gray-100 pb-1">
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
                            "text-sm truncate pt-1",
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
                <div className="text-center py-12 col-span-full border border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-1">
            {newMatches.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newMatches.map((match) => (
                  <Link href={`/chat/${match.id}`} key={match.id}>
                    <div className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/30 transition-colors text-center border border-gray-200 hover:border-gray-300">
                      <div className="relative mb-3">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-gray-200">
                          <AvatarImage src={match.image[0] as string} alt={match.name} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        {match.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
                        )}
                      </div>
                      <h3 className="font-medium border-b border-gray-100 pb-1 w-full">{match.name}</h3>
                      <span className="text-xs text-pink-500 mt-1">{match.timestamp}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-gray-200 rounded-lg">
                <p className="text-muted-foreground">No new matches</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}