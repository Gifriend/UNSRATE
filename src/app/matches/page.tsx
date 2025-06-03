"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { api } from "@/app/services/api"
import { Match, MatchListResponse } from "@/app/types/match"

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    totalPages: 0,
    totalMatches: 0,
  })

  // Fungsi untuk mengambil data matches
  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await api.get<MatchListResponse>("matches", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: "recent"
        }
      })
      
      setMatches(response.data.matches)
      setPagination({
        ...pagination,
        totalPages: response.data.pagination.totalPages,
        totalMatches: response.data.pagination.totalMatches,
      })
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [pagination.page])

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return "Kemarin"
    } else {
      return `${Math.floor(diffInHours / 24)}h`
    }
  }

  const filteredMatches = matches.filter(
    match =>
      match.matchedUser.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
  }

  // Fungsi untuk menghapus match
  const handleUnmatch = async (matchId: string) => {
    try {
      await api.delete(`matches/${matchId}`)
      setMatches(prev => prev.filter(match => match.id !== matchId))
      setSelectedMatch(null)
    } catch (error) {
      console.error("Failed to unmatch:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 md:px-0">
        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Panel kiri - Daftar match */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
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

            {loading ? (
              <div className="text-center py-12">
                <p>Loading matches...</p>
              </div>
            ) : filteredMatches.length > 0 ? (
              <div className="space-y-1">
                {filteredMatches.map((match) => (
                  <div 
                    key={match.id} 
                    onClick={() => handleMatchClick(match)}
                    className="cursor-pointer"
                  >
                    <Link href={`/chat/${match.id}`} className="block md:hidden">
                      <MatchItem 
                        match={match} 
                        formatTimestamp={formatTimestamp}
                      />
                    </Link>
                    <div className="hidden md:block">
                      <MatchItem 
                        match={match} 
                        isSelected={selectedMatch?.id === match.id}
                        formatTimestamp={formatTimestamp}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No messages found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                disabled={pagination.page === 0}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <span>Page {pagination.page + 1} of {pagination.totalPages}</span>
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Panel kanan - Preview chat */}
          <div className="hidden md:block md:col-span-8 lg:col-span-9">
            {selectedMatch ? (
              <div className="border rounded-lg h-[calc(100vh-12rem)] flex flex-col">
                <div className="border-b p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage 
                        src={selectedMatch.matchedUser.profilePicture} 
                        alt={selectedMatch.matchedUser.fullname} 
                      />
                      <AvatarFallback>
                        {selectedMatch.matchedUser.fullname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{selectedMatch.matchedUser.fullname}</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedMatch.matchedUser.fakultas} - {selectedMatch.matchedUser.prodi}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/profile/${selectedMatch.matchedUser.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleUnmatch(selectedMatch.id)}
                    >
                      Unmatch
                    </Button>
                  </div>
                </div>
                <div className="flex-1 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Continue your conversation with {selectedMatch.matchedUser.fullname}
                    </p>
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

// Komponen MatchItem yang diperbarui
function MatchItem({ 
  match, 
  isSelected = false,
  formatTimestamp
}: { 
  match: Match;
  isSelected?: boolean;
  formatTimestamp: (isoString: string) => string;
}) {
  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-lg transition-colors",
        isSelected ? "bg-muted" : match.unreadCount > 0 ? "bg-muted/50" : "hover:bg-muted/30",
      )}
    >
      <div className="relative mr-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage 
            src={match.matchedUser.profilePicture} 
            alt={match.matchedUser.fullname} 
          />
          <AvatarFallback>{match.matchedUser.fullname[0]}</AvatarFallback>
        </Avatar>
        {/* Status online - perlu diimplementasi terpisah */}
        {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span> */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{match.matchedUser.fullname}</h3>
          <span className={cn("text-xs", match.unreadCount > 0 ? "text-pink-500 font-medium" : "text-muted-foreground")}>
            {match.lastMessage 
              ? formatTimestamp(match.lastMessage.createdAt) 
              : formatTimestamp(match.createdAt)}
          </span>
        </div>
        <p className={cn(
          "text-sm truncate", 
          match.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {match.lastMessage?.content || "Mulai percakapan"}
        </p>
      </div>
    </div>
  )
}