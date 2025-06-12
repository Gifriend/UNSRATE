"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Info } from "lucide-react"
import type { Match } from "@/app/types/match"

interface ChatSidebarProps {
  matchInfo: Match
  onReport: () => void
  isReporting: boolean
}

export default function ChatSidebar({ matchInfo, onReport, isReporting }: ChatSidebarProps) {
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
    <div className="hidden md:block md:col-span-3 lg:col-span-3">
      <Card className="sticky top-4">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Link href={`/profile/${matchInfo.matchedUser.id}`} className="group relative">
            <Avatar className="h-24 w-24 mb-4 ring-2 ring-transparent group-hover:ring-pink-500 transition-all">
              <AvatarImage
                src={matchInfo.matchedUser.profilePicture || "/placeholder.svg" || "/placeholder.svg"}
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
                onClick={onReport}
                disabled={isReporting}
              >
                {isReporting ? (
                  "Mengirim laporan..."
                ) : (
                  <>
                    <Info className="h-4 w-4 mr-2" /> Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
