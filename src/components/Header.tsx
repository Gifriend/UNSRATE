"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Heart, LogOut, MessageCircle, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between pl-10">
        <Link href="/swipe" className="flex items-center gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto bg-transparent hover:bg-transparent">
                <div
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
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white ">
              <Link href="/profile">
                <DropdownMenuItem className='border-b'>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/login">
                <DropdownMenuItem className="text-rose-500 focus:text-rose-500 bg-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
