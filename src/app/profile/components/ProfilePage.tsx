"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/toast-context"
import { api } from "@/app/services/api"
import Header from "@/components/Header"
import ProfileHeader from "./ProfileHeader"
import ProfileTabs from "./ProfileTabs"
import { UserProfile } from "@/app/types/userProfileTypes"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { toast } = useToast()

  // Use useCallback to memoize the fetch function and prevent re-creation
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('users/profile')
      
      if (response.data.statusCode === 200) {
        setProfile(response.data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "An error occurred while loading your profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast]) // Only recreate if toast changes

  // Fetch profile only once on mount
  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile]) // Stable dependency due to useCallback

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl flex items-center justify-center h-[80vh]">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl flex items-center justify-center h-[80vh]">
          <p>Failed to load profile. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl">
        <ProfileHeader profile={profile} />
        <ProfileTabs profile={profile} setProfile={setProfile} />
      </main>
    </div>
  )
}