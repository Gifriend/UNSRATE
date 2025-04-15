"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { Badge } from "@/components/ui/badge"
import { Bookmark, GraduationCap, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
  id: number
  name: string
  age: number
  bio: string
  location?: string
  education?: string
  interests?: string[]
  images: (string | StaticImageData)[]
}

interface SwipeCardProps {
  profile: Profile
}

export default function SwipeCard({ profile }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const nextImage = () => {
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[70vh] bg-background rounded-3xl shadow-lg overflow-hidden border">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-muted">
          <Image
            src={profile.images[currentImageIndex] || "/placeholder.svg?height=600&width=400"}
            alt={`Foto ${profile.name}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
        </div>

        {/* Image navigation */}
        <div className="absolute inset-x-0 top-0 h-full flex">
          <div className="w-1/2 h-full" onClick={prevImage}></div>
          <div className="w-1/2 h-full" onClick={nextImage}></div>
        </div>

        {/* Image indicators */}
        <div className="absolute top-4 inset-x-0 px-4">
          <div className="flex space-x-1">
            {profile.images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  index === currentImageIndex ? "bg-white" : "bg-white/40",
                )}
              ></div>
            ))}
          </div>
        </div>

        {/* Profile info */}
        <div
          className={cn(
            "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white transition-all duration-300",
            showDetails ? "h-2/3" : "h-auto",
          )}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold">
              {profile.name}, {profile.age}
            </h3>
            <button className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <Bookmark className="h-5 w-5 text-white" />
            </button>
          </div>

          {profile.location && (
            <div className="flex items-center gap-1 mt-2 text-white/80">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}

          {profile.education && (
            <div className="flex items-center gap-1 mt-1 text-white/80">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm">{profile.education}</span>
            </div>
          )}

          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              showDetails ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0",
            )}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-1">About</h4>
                <p className="text-sm">{profile.bio}</p>
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge key={index} className="bg-white/20 text-white hover:bg-white/30">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

