"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhotoUploadModal } from "@/components/photo-upload-modal"
import { useToast } from "@/components/ui/toast-context"
import { api } from "@/app/services/api"
import { UserProfile } from "@/app/types/userProfileTypes"

interface ProfileHeaderProps {
  profile: UserProfile
  setProfile?: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function ProfileHeader({ profile, setProfile }: ProfileHeaderProps) {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const { toast } = useToast()

  const handlePhotoUpload = async (file: File) => {
    if (!file) {
    toast({
      title: "No file selected",
      description: "Please choose a photo to upload.",
      variant: "destructive",
    });
    return;
  }
    setIsUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Upload photo to your API endpoint
      const response = await api.post('users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.statusCode === 200) {
        // Update profile with new photo URL
        if (setProfile) {
          setProfile(prev => prev ? {
            ...prev,
            profilePicture: response.data.data.profilePicture
          } : null)
        }

        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  return (
    <div className="relative mb-6 md:mb-10">
      {/* Background gradient */}
      <div className="h-40 md:h-60 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
      
      {/* Profile picture section */}
      <div className="absolute top-28 left-4 md:top-40 md:left-10 group">
        <div className="relative rounded-full border-4 border-background bg-muted h-24 w-24 md:h-40 md:w-40 overflow-hidden">
          {profile.profilePicture ? (
            <Image 
              src={profile.profilePicture} 
              alt="Profile Photo" 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xl md:text-4xl font-bold">
              {profile.fullname.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
            <PhotoUploadModal
              onSave={handlePhotoUpload}
              isUploading={isUploadingPhoto}
              triggerButton={
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                >
                  <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Edit</span>
                </Button>
              }
            />
          </div>
        </div>
        
        {/* Edit button badge */}
        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2">
          <PhotoUploadModal
            onSave={handlePhotoUpload}
            isUploading={isUploadingPhoto}
            triggerButton={
              <Button
                variant="default"
                size="icon"
                className="h-7 w-7 md:h-10 md:w-10 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 border-2 border-background"
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Edit3 className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </Button>
            }
          />
        </div>

        {/* Upload status indicator */}
        {isUploadingPhoto && (
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 shadow-sm">
              Uploading...
            </div>
          </div>
        )}
      </div>
      
      {/* Profile completion card */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 md:p-3">
        <div className="text-xs text-muted-foreground">Profile Completion</div>
        <div className="w-full bg-muted rounded-full h-2 mt-1">
          <div 
            className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
            style={{width: `${profile.profileCompletion}%`}}
          ></div>
        </div>
        <div className="text-xs mt-1 font-medium">{profile.profileCompletion}%</div>
      </div>

      {/* Profile info */}
      <div className="pt-16 pb-6 md:pt-20 md:pb-8 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {profile.fullname}, {profile.age}
        </h1>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground flex-wrap">
          {profile.alamat && <span className="text-sm">{profile.alamat}</span>}
          {profile.fakultas && (
            <>
              <span className="text-xs">•</span>
              <span className="text-sm">{profile.fakultas}</span>
            </>
          )}
          {profile.prodi && (
            <>
              <span className="text-xs">•</span>
              <span className="text-sm">{profile.prodi}</span>
            </>
          )}
        </div>
        
        {profile.missingFields && profile.missingFields.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <h3 className="font-medium text-sm mb-1">Complete your profile</h3>
            <p className="text-xs">
              Missing information: {profile.missingFields.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}