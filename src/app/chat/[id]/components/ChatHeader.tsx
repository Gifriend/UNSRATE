"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreHorizontal, User, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Match } from "@/app/types/match"

interface ChatHeaderProps {
  matchInfo: Match
  isConnected: boolean
  onReport: () => void
}

export default function ChatHeader({ matchInfo, isConnected, onReport }: ChatHeaderProps) {
  return (
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
              src={matchInfo.matchedUser.profilePicture || "/placeholder.svg" || "/placeholder.svg"}
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
            <DropdownMenuItem onClick={onReport}>
              <Info className="h-4 w-4 mr-2" /> Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
