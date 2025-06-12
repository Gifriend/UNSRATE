import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UserProfile } from "./ProfileViewPage"

interface ProfileInfoProps {
  profile: UserProfile
  matchId: string | null
}

export default function ProfileInfo({ profile, matchId }: ProfileInfoProps) {
  const router = useRouter()

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            {profile.fullname}, {profile.age}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            {profile.fakultas && (
              <div className="flex items-center">
                <span className="text-sm">{profile.fakultas}</span>
              </div>
            )}
            {profile.prodi && (
              <div className="flex items-center">
                <span className="text-xs mx-1">•</span>
                <span className="text-sm">{profile.prodi}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {matchId && (
            <Button className="rounded-full px-4 gap-2" onClick={() => router.push(`/chat/${matchId}`)}>
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Message</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}