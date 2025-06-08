"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Heart, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { matchApi } from "@/app/services/api"
import type { MatchedUser } from "@/app/types/match"

interface UserProfile extends MatchedUser {
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

  // Fetch user profile data from match data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching user profile for ID:", id)

        // Try to get matchId from localStorage if available
        const storedMatchId = typeof window !== "undefined" ? localStorage.getItem("currentMatchId") : null

        // If we have a stored matchId, use it to fetch match data
        if (storedMatchId) {
          const response = await matchApi.getMatchById(storedMatchId)
          console.log("Match response for profile:", response)

          // Extract match data
          let matchData = null
          if (response.data?.match) {
            matchData = response.data.match
          } else if (response.data?.data) {
            matchData = response.data.data
          } else if (response.data) {
            matchData = response.data
          }

          if (matchData && matchData.matchedUser && matchData.matchedUser.id === id) {
            // We found the correct match with the user we're looking for
            setMatchId(storedMatchId)

            // Create profile from matchedUser data
            const userProfile: UserProfile = {
              ...matchData.matchedUser,
              // Add additional fields
              online: false,
              compatibility: Math.floor(Math.random() * 30) + 70, // Random 70-99% compatibility for demo
              matchDate: formatMatchDate(matchData.createdAt),
            }

            setProfile(userProfile)
            setError(null)
          } else {
            // The stored match doesn't contain the user we're looking for
            // We need to fetch all matches and find the one with this user
            await fetchFromAllMatches()
          }
        } else {
          // No stored matchId, fetch from all matches
          await fetchFromAllMatches()
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setError("Failed to load user profile")
      } finally {
        setIsLoading(false)
      }
    }

    // Helper function to fetch from all matches
    const fetchFromAllMatches = async () => {
      try {
        // Fetch all matches to find the one with this user
        const response = await matchApi.getMatches({ page: 0, limit: 50 })
        console.log("All matches response:", response)

        if (response.data?.matches && Array.isArray(response.data.matches)) {
          // Find the match that contains the user with this ID
          const match = response.data.matches.find((m: any) => m.matchedUser && m.matchedUser.id === id)

          if (match) {
            setMatchId(match.id)

            // Create profile from matchedUser data
            const userProfile: UserProfile = {
              ...match.matchedUser,
              // Add additional fields
              online: false,
              compatibility: Math.floor(Math.random() * 30) + 70, // Random 70-99% compatibility for demo
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

  // Format match date
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

  // Create an array of images (use the profile picture or placeholders)
  const images = profile.profilePicture ? [profile.profilePicture] : ["/placeholder.svg?height=400&width=400"]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* Profile header with image carousel */}
        <div className="relative mb-6 rounded-xl overflow-hidden bg-muted">
          <div className="aspect-[3/2] md:aspect-[2/1] relative">
            <Image
              src={images[activeImageIndex] || "/placeholder.svg?height=400&width=400"}
              alt={`${profile.fullname}'s photo`}
              fill
              className="object-cover transition-opacity duration-300"
              priority
            />

            {/* Image navigation dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeImageIndex === index ? "bg-white w-6" : "bg-white/60 hover:bg-white/80",
                    )}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* Image navigation arrows */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  >
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </Button>
                </div>
              </>
            )}

            {/* Online status */}
            {profile.online && (
              <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 rounded-full bg-white mr-1.5"></span>
                Online now
              </div>
            )}

            {/* Compatibility badge */}
            {profile.compatibility && (
              <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                {profile.compatibility}% Match
              </div>
            )}
          </div>
        </div>

        {/* Profile info */}
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

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="about" className="flex-1">
              About
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex-1">
              Photos
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-medium text-lg md:text-xl mb-4">About {profile.fullname}</h2>
                <p className="text-muted-foreground md:text-base">{profile.bio || "No bio available"}</p>
              </CardContent>
            </Card>

            {profile.matchDate && (
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">You matched {profile.matchDate}</h3>
                      <p className="text-sm text-muted-foreground">
                        Start a conversation to get to know each other better
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-medium text-lg md:text-xl mb-4">{profile.fullname}&apos;s Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-md relative overflow-hidden cursor-pointer"
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=200&width=200"}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-medium text-lg md:text-xl mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                    <p>{profile.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Faculty</h3>
                    <p>{profile.fakultas || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Study Program</h3>
                    <p>{profile.prodi || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile.compatibility && (
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{profile.compatibility}% Compatibility</h3>
                      <p className="text-sm text-muted-foreground">
                        You and {profile.fullname} share similar interests and preferences
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
