import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AboutSection from "./AboutSection"
import PhotosSection from "./PhotosSection"
import InterestsSection from "./InterestsSection"
import { UserProfile } from "@/app/types/userProfileTypes"

interface ProfileTabsProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function ProfileTabs({ profile, setProfile }: ProfileTabsProps) {
  return (
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
          <TabsContent value="about">
            <AboutSection profile={profile} setProfile={setProfile} />
          </TabsContent>
          <TabsContent value="photos">
            <PhotosSection profile={profile} setProfile={setProfile} />
          </TabsContent>
          <TabsContent value="interests">
            <InterestsSection profile={profile} setProfile={setProfile} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}