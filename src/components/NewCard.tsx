"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, GraduationCap, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/app/types/swipe";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  profile: Profile;
}

export default function NewCard({ profile }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === profile.Photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? profile.Photos.length - 1 : prevIndex - 1
    );
  };

  const displayName = profile.fullname || profile.name;

  const allImages =
    profile.Photos && profile.Photos.length > 0
      ? profile.Photos
      : ["/placeholder.svg?height=600&width=400"];

  return (
    <div className="relative w-full max-w-md mx-auto h-[70vh]  rounded-3xl shadow-lg box ">
      <div className="relative h-full rounded-3xl ">
        {/* Main Image */}
        <div className="absolute inset-0 rounded-3xl  ">
          <Image
            src={allImages[currentImageIndex] || "/placeholder.svg"}
            alt={`Foto ${displayName}`}
            fill
            className="object-cover transition-opacity rounded-3xl duration-300 "
            priority
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "/placeholder.svg?height=600&width=400";
            }}
          />
        </div>

        {/* Image navigation areas */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-0 top-0 h-full flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={prevImage}
            ></div>
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={nextImage}
            ></div>
          </div>
        )}

        {/* Image indicators */}
        {allImages.length > 1 && (
          <div className="absolute top-4 inset-x-0 px-4">
            <div className="flex space-x-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index === currentImageIndex ? "bg-white" : "bg-white/40"
                  )}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Match Score Badge */}
        {profile.matchScore && (
          <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            <Heart className="inline mr-1" size={14} fill="white" />
            {profile.matchScore}% Match
          </div>
        )}

        {/* Profile info overlay */}
        <div
          className={cn(
            "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white transition-all duration-300 cursor-pointer rounded-3xl",
            showDetails ? "h-2/3" : "h-auto"
          )}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold">
              {displayName}, {profile.age}
            </h3>
            <button className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <Bookmark className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Academic info */}
          {(profile.fakultas || profile.prodi) && (
            <div className="flex items-center gap-1 mt-2 text-white/80">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm">
                {profile.prodi && profile.fakultas
                  ? `${profile.prodi}, ${profile.fakultas}`
                  : profile.fakultas || profile.prodi}
              </span>
            </div>
          )}

          {/* Expandable details */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              showDetails
                ? "max-h-[500px] opacity-100 mt-4"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-1">
                    About
                  </h4>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        className="bg-white/20 text-white hover:bg-white/30"
                      >
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tap to expand hint */}
          {!showDetails && (
            <div className="mt-2 text-white/60 text-xs">
              Tap to see more details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
