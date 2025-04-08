"use client"
import Link from 'next/link';
import Image from 'next/image';
import satria from '../src/app/assets/img/satria.jpg';
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { cn } from "@/app/lib/utils"
import { Heart, MessageCircle } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between pl-5">
        <Link href="/swipe" className="flex items-center gap-2 ">
          <div className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-1">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            UNSRATE
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/swipe"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-foreground/80",
              pathname === "/swipe" ? "text-pink-500" : "text-muted-foreground",
            )}  
          >
            <Heart className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/matches"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-foreground/80 relative",
              pathname.includes("/matches") || pathname.includes("/chat") ? "text-pink-500" : "text-muted-foreground",
            )}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Messages</span>
            <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white">
              3
            </span>
          </Link>

          <Link
            href="/profile"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-foreground/80",
              pathname === "/profile" ? "text-pink-500" : "text-muted-foreground",
            )}
          >
            <Avatar className="h-6 w-6 border border-muted">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

