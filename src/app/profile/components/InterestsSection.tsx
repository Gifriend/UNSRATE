"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Plus, ChevronDown } from "lucide-react"
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
  const [selectedInterestId, setSelectedInterestId] = useState("")
  const [editedInterests, setEditedInterests] = useState<Interest[]>(profile.interests || [])
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([])
  const [isLoadingInterests, setIsLoadingInterests] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch available interests from backend
  useEffect(() => {
    if (isEditingInterests) {
      const fetchAvailableInterests = async () => {
        setIsLoadingInterests(true)
        try {
          const response = await api.get("interests")
          setAvailableInterests(response.data)
        } catch (error) {
          console.error("Failed to fetch interests", error)
          toast({
            title: "Error",
            description: "Failed to load available interests",
            variant: "destructive",
          })
        } finally {
          setIsLoadingInterests(false)
        }
      }
      
      fetchAvailableInterests()
    }
  }, [isEditingInterests, toast])

  // Remove interest from temporary list
  const handleRemoveInterest = useCallback(
    (interestId: string) => {
      setEditedInterests(editedInterests.filter(item => item.id !== interestId))
    },
    [editedInterests]
  )

  // Add selected interest
  const handleAddInterest = useCallback(() => {
    if (!selectedInterestId) return

    // Check if interest is already added
    if (editedInterests.some(item => item.id === selectedInterestId)) {
      toast({
        title: "Warning",
        description: "Interest already added",
        variant: "default",
      })
      return
    }

    // Find selected interest from available interests
    const selectedInterest = availableInterests.find(
      interest => interest.id === selectedInterestId
    )

    if (selectedInterest) {
      setEditedInterests([...editedInterests, selectedInterest])
      setSelectedInterestId("")
      setIsDropdownOpen(false)
    }
  }, [selectedInterestId, editedInterests, availableInterests, toast])

  // Save interest changes to backend
  const handleSaveInterests = useCallback(async () => {
    try {
      // Send only valid interest IDs
      await api.patch("users/profile", {
        setInterests: editedInterests.map(i => i.id),
      })

      // Update profile state
      setProfile(prev => 
        prev ? { ...prev, interests: editedInterests } : null
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

  // Cancel changes
  const handleCancelInterests = useCallback(() => {
    setEditedInterests(profile.interests || [])
    setIsEditingInterests(false)
    setSelectedInterestId("")
    setIsDropdownOpen(false)
  }, [profile.interests])

  // Filter unselected interests
  const unselectedInterests = availableInterests.filter(
    interest => !editedInterests.some(i => i.id === interest.id)
  )

  // Get display text for dropdown trigger
  const getTriggerText = () => {
    if (isLoadingInterests) return "Loading interests..."
    if (unselectedInterests.length === 0) return "All interests added"
    const selected = availableInterests.find(i => i.id === selectedInterestId)
    return selected ? selected.name : "Select an interest"
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-medium text-lg md:text-xl">My Interests</h2>
          {!isEditingInterests ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditingInterests(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelInterests}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveInterests}
                disabled={isLoadingInterests}
              >
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
                  editedInterests.map(interest => (
                    <Badge 
                      key={interest.id} 
                      variant="secondary" 
                      className="px-3 py-1 md:text-sm group"
                    >
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
                  <p className="text-muted-foreground text-sm">
                    No interests selected yet.
                  </p>
                )}
              </div>
            </div>

            {/* Add Interest */}
            <div>
              <h3 className="text-sm font-medium mb-2">Add Interest:</h3>
              <div className="flex gap-2">
                <div className="relative flex-1" ref={dropdownRef}>
                  <div
                    className="flex items-center justify-between w-full px-3 py-2 border border-input bg-background rounded-md text-sm cursor-pointer hover:bg-muted"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={selectedInterestId ? "text-foreground" : "text-muted-foreground"}>
                      {getTriggerText()}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                  {isDropdownOpen && unselectedInterests.length > 0 && !isLoadingInterests && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                      {unselectedInterests.map(interest => (
                        <div
                          key={interest.id}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                          onClick={() => {
                            setSelectedInterestId(interest.id)
                            setIsDropdownOpen(false)
                          }}
                        >
                          {interest.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleAddInterest}
                  disabled={!selectedInterestId || isLoadingInterests}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                Only existing interests can be added
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {profile.interests && profile.interests.length > 0 ? (
              profile.interests.map(interest => (
                <Badge 
                  key={interest.id} 
                  variant="secondary" 
                  className="px-3 py-1 md:text-sm"
                >
                  {interest.name}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">
                No interests added yet. Click edit to add your interests.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}