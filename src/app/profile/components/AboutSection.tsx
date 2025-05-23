import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"
import { useToast } from "@/components/ui/toast-context"
import { api } from "@/app/services/api"
import { UserProfile } from "@/app/types/userProfileTypes"

interface AboutSectionProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function AboutSection({ profile, setProfile }: AboutSectionProps) {
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editedBio, setEditedBio] = useState(profile.bio || "")
  const { toast } = useToast()

  const handleSaveAbout = useCallback(async () => {
    try {
      await api.patch('/users/profile', {
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
  }, [editedBio, setProfile, toast])

  const handleCancelAbout = useCallback(() => {
    setEditedBio(profile?.bio || "")
    setIsEditingAbout(false)
  }, [profile?.bio])

  return (
    <div className="space-y-4">
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
    </div>
  )
}