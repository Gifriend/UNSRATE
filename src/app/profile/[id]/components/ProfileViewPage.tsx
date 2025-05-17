"use client"

import { useState, useEffect } from "react"
import Image, { type StaticImageData } from "next/image"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Heart, MapPin, MessageCircle, Share2, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Import gambar
import mikel from "../../../assets/img/mikel.png"
import mikel2 from "../../../assets/img/mikel2.jpg"
import clarissa from "../../../assets/img/clarissa.jpg"
import clarissa2 from "../../../assets/img/clarissa2.jpg"
import mario from "../../../assets/img/mario.jpg"
import mario2 from "../../../assets/img/mario2.png"


interface UserProfile {
  id: number
  name: string
  age: number
  bio: string
  location?: string
  education?: string
  interests?: string[]
  images: (string | StaticImageData)[]
  matchDate?: string
  compatibility?: number
  online?: boolean
}

export default function ProfileViewPage({ params }:  { params: { id: string } }) {
  const {id} = params;
  const router = useRouter()
//   const id = Number(params.id)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Simulasi data profil berdasarkan ID
  useEffect(() => {
    // Simulasi loading
    setIsLoading(true)

    // Simulasi fetch data
    setTimeout(() => {
      const profilesData: Record<number, UserProfile> = {
        1: {
          id: 1,
          name: "Mario",
          age: 18,
          bio: "Saya suka matematika dan machine learning. Mencari teman diskusi tentang AI dan teknologi terbaru.",
          location: "Manado, Sulawesi Utara",
          education: "Computer Science Student",
          interests: ["AI", "Mathematics", "Programming", "Chess"],
          images: [mario, mario2, ],
          matchDate: "2 hari yang lalu",
          compatibility: 85,
          online: true,
        },
        2: {
          id: 2,
          name: "Mikel",
          age: 21,
          bio: "Pencinta kopi dan musik. Suka menghabiskan waktu di kafe sambil menulis lagu.",
          location: "Jakarta",
          education: "Music Production",
          interests: ["Coffee", "Music", "Writing", "Guitar"],
          images: [mikel, mikel2],
          matchDate: "1 minggu yang lalu",
          compatibility: 78,
          online: false,
        },
        3: {
          id: 3,
          name: "Clarissa",
          age: 20,
          bio: "Foodie dan penikmat film. Selalu mencari restoran baru dan film yang menarik untuk ditonton.",
          location: "Bandung",
          education: "Culinary Arts",
          interests: ["Food", "Movies", "Travel", "Photography"],
          images: [clarissa, clarissa2],
          matchDate: "3 hari yang lalu",
          compatibility: 92,
          online: true,
        },
      }

      setProfile(profilesData[Number(id)] || null)
      setIsLoading(false)
    }, 800)
  }, [id])

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

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
              src={profile.images[activeImageIndex] || "/placeholder.svg"}
              alt={`${profile.name}'s photo`}
              fill
              className="object-cover transition-opacity duration-300"
              priority
            />

            {/* Image navigation dots */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
              {profile.images.map((_, index) => (
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

            {/* Image navigation arrows */}
            <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start px-4 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : profile.images.length - 1))}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end px-4 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                onClick={() => setActiveImageIndex((prev) => (prev < profile.images.length - 1 ? prev + 1 : 0))}
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </div>

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
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center">
                    <span className="text-xs mx-1">•</span>
                    <span className="text-sm">{profile.education}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button className="rounded-full px-4 gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Message</span>
              </Button>
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
            <TabsTrigger value="interests" className="flex-1">
              Interests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-medium text-lg md:text-xl mb-4">About {profile.name}</h2>
                <p className="text-muted-foreground md:text-base">{profile.bio}</p>
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
                <h2 className="font-medium text-lg md:text-xl mb-4">{profile.name}&apos;s Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-md relative overflow-hidden cursor-pointer"
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
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

          <TabsContent value="interests" className="space-y-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="font-medium text-lg md:text-xl mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {profile.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5 md:text-sm">
                      {interest}
                    </Badge>
                  ))}
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
                        You and {profile.name} share similar interests and preferences
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
