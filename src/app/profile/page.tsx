"use client"
import { useState } from 'react';
import satria from '../assets/img/satria.jpg';
import satria2 from '../assets/img/satria1.jpg';
import satria3 from '../assets/img/satria2.jpg';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Header from "@/app/components/Header"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Camera, Edit, Plus, Settings } from "lucide-react"

// Definisi tipe untuk profil
interface UserProfile {
  name: string;
  age: number;
  bio: string;
  images: (string | StaticImageData)[];
  interests?: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Satrian Amu",
    age: 21,
    bio: "Pria yang Lucu, Asik, Menyenangkan dan suka Coding",
    images: [satria, satria2, satria3],
    interests: ["Coding", "Gaming", "Movies", "Music", "Travel"],
  });

 return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="relative mb-6">
          <div className="h-40 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
          <div className="absolute -bottom-16 left-6 rounded-full border-4 border-background bg-muted h-32 w-32 overflow-hidden">
            <Image src={profile.images[0] || "/placeholder.svg"} alt="Profile Photo" fill className="object-cover" />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
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
          </div>
        </div>

        <div className="pt-16 pb-6">
          <h1 className="text-2xl font-bold">
            {profile.name}, {profile.age}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            {/* {profile.location && <span className="text-sm">{profile.location}</span>}
            {profile.education && (
              <>
                <span className="text-xs">•</span>
                <span className="text-sm">{profile.education}</span>
              </>
            )} */}
          </div>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-lg mb-2">About Me</h2>
                <p className="text-muted-foreground">{profile.bio}</p>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              Edit Profile
            </Button>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {profile.images.map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-md relative overflow-hidden group">
                  <Image src={image || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <Button size="icon" variant="ghost" className="h-10 w-10">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Manage Photos
            </Button>
          </TabsContent>

          <TabsContent value="interests" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-lg mb-4">My Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="px-3 py-1 border-dashed">
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              Edit Interests
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

