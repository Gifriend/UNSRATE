"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Check, Edit, Plus, Save, X } from "lucide-react"
import { PhotoUploadModal } from "@/components/photo-upload-modal"
import { cn } from "@/lib/utils"
import { api } from "@/app/services/api" 
import { useToast } from "@/components/ui/toast-context"

interface UserProfile {
  id: string
  fullname: string
  nim: string
  email: string
  profilePicture: string | null
  Photos: {id: string, url: string}[]
  bio: string | null
  fakultas: string | null
  prodi: string | null
  age: number
  gender: string | null
  alamat: string | null
  verified: boolean
  interests: string[]
  profileCompletion: number
  missingFields: string[]
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  
  // Edit states
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editedBio, setEditedBio] = useState("")
  const [isEditingInterests, setIsEditingInterests] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [editedInterests, setEditedInterests] = useState<string[]>([])

  // Photo management
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)

   const { toast } = useToast()

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await api.get('users/profile')
        
        if (response.data.statusCode === 200) {
          setProfile(response.data.data)
          setEditedBio(response.data.data.bio || "")
          setEditedInterests(response.data.data.interests || [])
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
    }

    fetchUserProfile()
  }, [toast])

  // Handle about section editing
  const handleSaveAbout = async () => {
    try {
      await api.put('/user/profile', {
        bio: editedBio
      })
      
      setProfile(profile => profile ? {
        ...profile,
        bio: editedBio,
      } : null)
      
      setIsEditingAbout(false)
      toast({
        title: "Success",
        description: "Bio updated successfully",
      })
    } catch (error) {
      console.error("Error updating bio:", error)
      toast({
        title: "Error",
        description: "Failed to update bio",
        variant: "destructive"
      })
    }
  }

  const handleCancelAbout = () => {
    setEditedBio(profile?.bio || "")
    setIsEditingAbout(false)
  }

  // Handle interests editing
  const handleAddInterest = () => {
    if (newInterest.trim() && !editedInterests.includes(newInterest.trim())) {
      setEditedInterests([...editedInterests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setEditedInterests(editedInterests.filter((item) => item !== interest))
  }

  const handleSaveInterests = async () => {
    try {
      await api.put('/user/profile', {
        interests: editedInterests
      })
      
      setProfile(profile => profile ? {
        ...profile,
        interests: editedInterests,
      } : null)
      
      setIsEditingInterests(false)
      toast({
        title: "Success",
        description: "Interests updated successfully",
      })
    } catch (error) {
      console.error("Error updating interests:", error)
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive"
      })
    }
  }

  const handleCancelInterests = () => {
    setEditedInterests(profile?.interests || [])
    setIsEditingInterests(false)
    setNewInterest("")
  }

  // Handle photo upload
  const handlePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      
      const response = await api.post('/user/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Assuming the API returns the updated user profile or at least the new photo data
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        // Refresh the profile to get the updated photos
        const profileResponse = await api.get('/user/profile')
        if (profileResponse.data.statusCode === 200) {
          setProfile(profileResponse.data.data)
        }
      }
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive"
      })
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await api.delete(`/user/photos/${photoId}`)
      
      // Update local state
      setProfile(profile => {
        if (!profile) return null
        
        return {
          ...profile,
          Photos: profile.Photos.filter(photo => photo.id !== photoId)
        }
      })
      
      setActivePhotoIndex(null)
      setShowPhotoOptions(false)
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive"
      })
    }
  }

  const handleSetProfilePhoto = async (photoUrl: string) => {
    try {
      await api.put('/user/profile', {
        profilePicture: photoUrl
      })
      
      // Update local state
      setProfile(profile => {
        if (!profile) return null
        
        return {
          ...profile,
          profilePicture: photoUrl
        }
      })
      
      setActivePhotoIndex(null)
      setShowPhotoOptions(false)
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      console.error("Error setting profile photo:", error)
      toast({
        title: "Error",
        description: "Failed to set profile photo",
        variant: "destructive"
      })
    }
  }

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
        <div className="relative mb-6 md:mb-10">
          <div className="h-40 md:h-60 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
          <div className="absolute -bottom-16 left-6 md:left-10 rounded-full border-4 border-background bg-muted h-32 w-32 md:h-40 md:w-40 overflow-hidden">
            {profile.profilePicture ? (
              <Image 
                src={profile.profilePicture} 
                alt="Profile Photo" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                {profile.fullname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Profile completion indicator */}
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2">
            <div className="text-xs text-muted-foreground">Profile Completion</div>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div 
                className="bg-pink-500 h-2 rounded-full" 
                style={{width: `${profile.profileCompletion}%`}}
              ></div>
            </div>
            <div className="text-xs mt-1 font-medium">{profile.profileCompletion}%</div>
          </div>
        </div>

        <div className="pt-16 pb-6 md:pt-20 md:pb-8 md:px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {profile.fullname}, {profile.age}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
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
          
          {/* Show missing fields alert if any */}
          {profile.missingFields && profile.missingFields.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <h3 className="font-medium text-sm mb-1">Complete your profile</h3>
              <p className="text-xs">
                Missing information: {profile.missingFields.join(', ')}
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="about" className="w-full">
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <TabsList className="grid w-full grid-cols-3 mb-6 md:flex md:flex-col md:space-y-2 md:h-auto md:bg-transparent md:p-0">
                <TabsTrigger value="about" className="md:justify-start md:w-full md:px-4">
                  About
                </TabsTrigger>
                <TabsTrigger value="photos" className="md:justify-start md:w-full md:px-4">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="interests" className="md:justify-start md:w-full md:px-4">
                  Interests
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="md:col-span-8">
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                      <h2 className="font-medium text-lg md:text-xl">About Me</h2>
                      {!isEditingAbout ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingAbout(true)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={handleCancelAbout}>
                            <X className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveAbout}>
                            <Save className="h-4 w-4 mr-2" /> Save
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditingAbout ? (
                      <Textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Write something about yourself..."
                      />
                    ) : (
                      <p className="text-muted-foreground md:text-base">
                        {profile.bio || "No bio yet. Click edit to add some information about yourself."}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Additional information card */}
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <h2 className="font-medium text-lg md:text-xl mb-4">Additional Information</h2>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">NIM</div>
                        <div className="text-sm font-medium">{profile.nim}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="text-sm font-medium">{profile.email}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Faculty</div>
                        <div className="text-sm font-medium">{profile.fakultas || "Not specified"}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Department</div>
                        <div className="text-sm font-medium">{profile.prodi || "Not specified"}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Gender</div>
                        <div className="text-sm font-medium">{profile.gender || "Not specified"}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Address</div>
                        <div className="text-sm font-medium">{profile.alamat || "Not specified"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos" className="space-y-4">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="font-medium text-lg md:text-xl">My Photos</h2>
                      <PhotoUploadModal
                        onSave={handlePhotoUpload}
                        triggerButton={
                          <Button variant="outline" size="sm" className="gap-2">
                            <Camera className="h-4 w-4" /> Add Photo
                          </Button>
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                      {/* Profile picture */}
                      {profile.profilePicture && (
                        <div
                          className="aspect-square bg-muted rounded-md relative overflow-hidden group"
                          onClick={() => {
                            setActivePhotoIndex(-1) // Special index for profile picture
                            setShowPhotoOptions(true)
                          }}
                        >
                          <Image
                            src={profile.profilePicture}
                            alt="Profile Picture"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        </div>
                      )}
                      
                      {/* Other photos */}
                      {profile.Photos && profile.Photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className={cn(
                            "aspect-square bg-muted rounded-md relative overflow-hidden group",
                            activePhotoIndex === index && "ring-2 ring-pink-500",
                          )}
                          onClick={() => {
                            setActivePhotoIndex(index)
                            setShowPhotoOptions(true)
                          }}
                        >
                          <Image
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <PhotoUploadModal
                        onSave={handlePhotoUpload}
                        triggerButton={
                          <div className="aspect-square bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:border-muted-foreground/40 transition-colors">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </div>
                        }
                      />
                    </div>

                    {/* Photo options modal */}
                    {showPhotoOptions && activePhotoIndex !== null && (
                      <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowPhotoOptions(false)}
                      >
                        <div
                          className="bg-background rounded-lg p-4 max-w-sm w-full mx-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h3 className="font-medium text-lg mb-4">Photo Options</h3>

                          <div className="space-y-2">
                            {activePhotoIndex >= 0 && (
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleSetProfilePhoto(profile.Photos[activePhotoIndex].url)}
                              >
                                <Check className="h-4 w-4 mr-2" /> Set as profile photo
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => {
                                if (activePhotoIndex >= 0) {
                                  handleDeletePhoto(profile.Photos[activePhotoIndex].id)
                                } else if (activePhotoIndex === -1 && profile.profilePicture) {
                                  // Logic to remove profile picture (set to null)
                                  handleSetProfilePhoto("")
                                }
                              }}
                            >
                              <X className="h-4 w-4 mr-2" /> {activePhotoIndex === -1 ? 'Remove profile photo' : 'Delete photo'}
                            </Button>

                            <Button variant="outline" className="w-full" onClick={() => setShowPhotoOptions(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interests" className="space-y-4">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="font-medium text-lg md:text-xl">My Interests</h2>
                      {!isEditingInterests ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingInterests(true)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={handleCancelInterests}>
                            <X className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveInterests}>
                            <Save className="h-4 w-4 mr-2" /> Save
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditingInterests ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {editedInterests.length > 0 ? (
                            editedInterests.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1 md:text-sm group">
                                {interest}
                                <button
                                  className="ml-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleRemoveInterest(interest)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">No interests added yet.</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add new interest..."
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                          />
                          <Button onClick={handleAddInterest} disabled={!newInterest.trim()}>
                            Add
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {profile.interests && profile.interests.length > 0 ? (
                          profile.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 md:text-sm">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No interests added yet. Click edit to add your interests.</p>
                        )}
                        
                        {!isEditingInterests && (
                          <Badge
                            variant="outline"
                            className="px-3 py-1 border-dashed md:text-sm cursor-pointer"
                            onClick={() => setIsEditingInterests(true)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}