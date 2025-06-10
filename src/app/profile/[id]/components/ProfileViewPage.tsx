"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { matchApi } from "@/app/services/api"
import type { MatchedUser } from "@/app/types/match"
import ImageCarousel from "./ImageCarousel"
import ProfileInfo from "./ProfileInfo"
import ProfileTabs from "./ProfileTabs"
import Header from "@/components/Header"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface UserProfile extends MatchedUser {
  compatibility?: number
  online?: boolean
  matchDate?: string
}

export default function ProfileViewPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching user profile for ID:", id)

        const storedMatchId = typeof window !== "undefined" ? localStorage.getItem("currentMatchId") : null

        if (storedMatchId) {
          const response = await matchApi.getMatchById(storedMatchId)
          console.log("Match response for profile:", response)

          let matchData = null
          if (response.data?.match) {
            matchData = response.data.match
          } else if (response.data?.data) {
            matchData = response.data.data
          } else if (response.data) {
            matchData = response.data
          }

          if (matchData && matchData.matchedUser && matchData.matchedUser.id === id) {
            setMatchId(storedMatchId)
            const userProfile: UserProfile = {
              ...matchData.matchedUser,
              online: false,
              compatibility: Math.floor(Math.random() * 30) + 70,
              matchDate: formatMatchDate(matchData.createdAt),
            }
            setProfile(userProfile)
            setError(null)
          } else {
            await fetchFromAllMatches()
          }
        } else {
          await fetchFromAllMatches()
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setError("Failed to load user profile")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchFromAllMatches = async () => {
      try {
        const response = await matchApi.getMatches({ page: 0, limit: 50 })
        console.log("All matches response:", response)

        if (response.data?.matches && Array.isArray(response.data.matches)) {
          const match = response.data.matches.find((m: any) => m.matchedUser && m.matchedUser.id === id)

          if (match) {
            setMatchId(match.id)
            const userProfile: UserProfile = {
              ...match.matchedUser,
              online: false,
              compatibility: Math.floor(Math.random() * 30) + 70,
              matchDate: formatMatchDate(match.createdAt),
            }
            setProfile(userProfile)
            setError(null)
          } else {
            console.error("User not found in any matches")
            setError("User not found in your matches")
          }
        } else {
          console.error("Invalid matches data format:", response.data)
          setError("Failed to load matches data")
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error)
        setError("Failed to load matches data")
      }
    }

    if (id) {
      fetchUserProfile()
    }
  }, [id])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "hari ini"
    if (diffInDays === 1) return "kemarin"
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan yang lalu`
    return `${Math.floor(diffInDays / 365)} tahun yang lalu`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <div className="animate-pulse space-y-8 w-full max-w-2xl">
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-8 bg-muted rounded-lg w-1/3"></div>
            <div className="h-4 bg-muted rounded-lg w-1/2"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The profile you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const images = profile.profilePicture ? [profile.profilePicture] : ["/placeholder.svg?height=400&width=400"]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl">
        <ImageCarousel
          images={images}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          profile={profile}
        />
        <ProfileInfo profile={profile} matchId={matchId} />
        <ProfileTabs profile={profile} images={images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
      </main>
    </div>
  )
}