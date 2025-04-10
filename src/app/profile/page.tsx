"use client"

import { useState } from "react"
import satria from '../assets/img/satria.jpg';
import satria2 from '../assets/img/satria1.jpg';
import satria3 from '../assets/img/satria2.jpg';
import Image, { type StaticImageData } from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Camera, Check, Edit, Plus, Save, Settings, X } from "lucide-react"
import { PhotoUploadModal } from "@/app/components/photo-upload-modal"
import { cn } from "@/app/lib/utils"

interface UserProfile {
  name: string
  age: number
  bio: string
  location?: string
  education?: string
  interests?: string[]
  images: (string | StaticImageData)[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Satrian Amu",
    age: 21,
    bio: "Pria yang Lucu, Asik, Menyenangkan dan suka Coding",
    location: "Manado, Sulawesi Utara",
    education: "Computer Science Student",
    interests: ["Coding", "Gaming", "Movies", "Music", "Travel"],
    images: [
      satria,
      satria2,
      satria3,
    ],
  })

  // Edit states
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editedBio, setEditedBio] = useState(profile.bio)
  const [isEditingInterests, setIsEditingInterests] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [editedInterests, setEditedInterests] = useState<string[]>(profile.interests || [])

  // Photo management
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)

  // Handle about section editing
  const handleSaveAbout = () => {
    setProfile({
      ...profile,
      bio: editedBio,
    })
    setIsEditingAbout(false)
  }

  const handleCancelAbout = () => {
    setEditedBio(profile.bio)
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

  const handleSaveInterests = () => {
    setProfile({
      ...profile,
      interests: editedInterests,
    })
    setIsEditingInterests(false)
  }

  const handleCancelInterests = () => {
    setEditedInterests(profile.interests || [])
    setIsEditingInterests(false)
    setNewInterest("")
  }

  // Handle photo upload
  const handlePhotoUpload = (file: File) => {
    // In a real app, you would upload the file to a server
    // and get back a URL. Here we're just creating a local URL.
    const newImageUrl = URL.createObjectURL(file)

    setProfile({
      ...profile,
      images: [...profile.images, newImageUrl],
    })
  }

  const handleDeletePhoto = (index: number) => {
    const newImages = [...profile.images]
    newImages.splice(index, 1)
    setProfile({
      ...profile,
      images: newImages,
    })
    setActivePhotoIndex(null)
    setShowPhotoOptions(false)
  }

  const handleSetProfilePhoto = (index: number) => {
    // Move the selected photo to the first position
    const newImages = [...profile.images]
    const [selectedImage] = newImages.splice(index, 1)
    newImages.unshift(selectedImage)

    setProfile({
      ...profile,
      images: newImages,
    })
    setActivePhotoIndex(null)
    setShowPhotoOptions(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl">
        <div className="relative mb-6 md:mb-10">
          <div className="h-40 md:h-60 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
          <div className="absolute -bottom-16 left-6 md:left-10 rounded-full border-4 border-background bg-muted h-32 w-32 md:h-40 md:w-40 overflow-hidden">
            <Image src={profile.images[0] || "/placeholder.svg"} alt="Profile Photo" fill className="object-cover" />
          </div>
          {/* <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        <div className="pt-16 pb-6 md:pt-20 md:pb-8 md:px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {profile.name}, {profile.age}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            {profile.location && <span className="text-sm">{profile.location}</span>}
            {profile.education && (
              <>
                <span className="text-xs">•</span>
                <span className="text-sm">{profile.education}</span>
              </>
            )}
          </div>
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

              {/* <div className="hidden md:block mt-6">
                <Button className="w-full" size="lg">
                  Edit Profile
                </Button>
              </div> */}
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
                      <p className="text-muted-foreground md:text-base">{profile.bio}</p>
                    )}
                  </CardContent>
                </Card>

                <Button className="w-full md:hidden" size="lg">
                  Edit Profile
                </Button>
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
                      {profile.images.map((image, index) => (
                        <div
                          key={index}
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
                            src={image || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>

                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
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
                            {activePhotoIndex !== 0 && (
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleSetProfilePhoto(activePhotoIndex)}
                              >
                                <Check className="h-4 w-4 mr-2" /> Set as main photo
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => handleDeletePhoto(activePhotoIndex)}
                            >
                              <X className="h-4 w-4 mr-2" /> Delete photo
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

                <Button className="w-full md:hidden" size="lg">
                  Manage Photos
                </Button>
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
                          {editedInterests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 md:text-sm group">
                              {interest}
                              <button
                                className="ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveInterest(interest)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add new interest..."
                            className="flex-1"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                          />
                          <Button onClick={handleAddInterest} disabled={!newInterest.trim()}>
                            Add
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {profile.interests?.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 md:text-sm">
                            {interest}
                          </Badge>
                        ))}
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

                <Button className="w-full md:hidden" size="lg">
                  Edit Interests
                </Button>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
