"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Save, X, Plus } from "lucide-react"
import { useToast } from "@/components/ui/toast-context"
import { api } from "@/app/services/api"
import type { UserProfile } from "@/app/types/userProfileTypes"

interface Interest {
  id: string
  name: string
}

interface InterestsSectionProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function InterestsSection({ profile, setProfile }: InterestsSectionProps) {
  const [isEditingInterests, setIsEditingInterests] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [editedInterests, setEditedInterests] = useState<Interest[]>(profile.interests || [])
  const { toast } = useToast()

  const handleAddInterest = useCallback(() => {
    if (newInterest.trim() && !editedInterests.some((i) => i.name.toLowerCase() === newInterest.trim().toLowerCase())) {
      const newInterestObj = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newInterest.trim(),
      }

      setEditedInterests([...editedInterests, newInterestObj])
      setNewInterest("")
    }
  }, [newInterest, editedInterests])

  const handleRemoveInterest = useCallback(
    (interestId: string) => {
      setEditedInterests(editedInterests.filter((item) => item.id !== interestId))
    },
    [editedInterests],
  )

  // Save interests using the backend's profile update endpoint
  const handleSaveInterests = useCallback(async () => {
    try {
      await api.patch("users/profile", {
        setInterests: editedInterests.map((i) => i.id),
      })

      setProfile((profile) =>
        profile
          ? {
              ...profile,
              interests: editedInterests,
            }
          : null,
      )

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
        variant: "destructive",
      })
    }
  }, [editedInterests, setProfile, toast])

  const handleCancelInterests = useCallback(() => {
    setEditedInterests(profile?.interests || [])
    setIsEditingInterests(false)
    setNewInterest("")
  }, [profile?.interests])

  return (
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
            {/* Selected Interests */}
            <div>
              <h3 className="text-sm font-medium mb-2">Selected Interests:</h3>
              <div className="flex flex-wrap gap-2 md:gap-3 min-h-[2rem]">
                {editedInterests.length > 0 ? (
                  editedInterests.map((interest) => (
                    <Badge key={interest.id} variant="secondary" className="px-3 py-1 md:text-sm group">
                      {interest.name}
                      <button
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveInterest(interest.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No interests selected yet.</p>
                )}
              </div>
            </div>

            {/* Add Interest */}
            <div>
              <h3 className="text-sm font-medium mb-2">Add Interest:</h3>
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Enter interest..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                />
                <Button onClick={handleAddInterest} disabled={!newInterest.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {profile.interests && profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <Badge key={interest.id} variant="secondary" className="px-3 py-1 md:text-sm">
                  {interest.name}
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
  )
}
