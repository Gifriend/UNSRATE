import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart } from "lucide-react"
import type { UserProfile } from "./ProfileViewPage"

interface ProfileTabsProps {
  profile: UserProfile
  images: string[]
  activeImageIndex: number
  setActiveImageIndex: (index: number) => void
}

export default function ProfileTabs({ profile, images, activeImageIndex, setActiveImageIndex }: ProfileTabsProps) {
  return (
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
            <h2 className="font-medium text-lg md:text-xl mb-4">{profile.fullname}'s Photos</h2>
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
                <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
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
  )
}