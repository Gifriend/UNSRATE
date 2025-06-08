import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { api } from "@/app/services/api";
import { UserProfile } from "@/app/types/userProfileTypes";

interface InterestsSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export default function InterestsSection({ profile, setProfile }: InterestsSectionProps) {
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [editedInterests, setEditedInterests] = useState<{ id: string; name: string }[]>(
    profile.interests || []
  );
  const { toast } = useToast();

  // Fetch or create an interest by name
  const getOrCreateInterest = useCallback(
    async (name: string): Promise<{ id: string; name: string }> => {
      try {
        // Try to find existing interest
        const response = await api.get(`/interests?name=${encodeURIComponent(name)}`);
        if (response.data.data && response.data.data.length > 0) {
          return response.data.data[0]; // Return first matching interest
        }

        // Create new interest if not found
        const createResponse = await api.post("/interests", { name });
        return createResponse.data.data;
      } catch (error) {
        console.error("Error fetching/creating interest:", error);
        throw error;
      }
    },
    []
  );

  const handleAddInterest = useCallback(async () => {
    if (newInterest.trim() && !editedInterests.some((i) => i.name.toLowerCase() === newInterest.trim().toLowerCase())) {
      try {
        const interest = await getOrCreateInterest(newInterest.trim());
        setEditedInterests([...editedInterests, interest]);
        setNewInterest("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add interest",
          variant: "destructive",
        });
      }
    }
  }, [newInterest, editedInterests, getOrCreateInterest, toast]);

  const handleRemoveInterest = useCallback(
    (interestId: string) => {
      setEditedInterests(editedInterests.filter((item) => item.id !== interestId));
    },
    [editedInterests]
  );

  const handleSaveInterests = useCallback(async () => {
    try {
      await api.patch("/users/profile", {
        setInterests: editedInterests.map((i) => i.id), // Send array of interest IDs
      });

      setProfile((profile) =>
        profile
          ? {
              ...profile,
              interests: editedInterests,
            }
          : null
      );

      setIsEditingInterests(false);
      toast({
        title: "Success",
        description: "Interests updated successfully",
      });
    } catch (error) {
      console.error("Error updating interests:", error);
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive",
      });
    }
  }, [editedInterests, setProfile, toast]);

  const handleCancelInterests = useCallback(() => {
    setEditedInterests(profile?.interests || []);
    setIsEditingInterests(false);
    setNewInterest("");
  }, [profile?.interests]);

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
            <div className="flex flex-wrap gap-2 md:gap-3">
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
  );
}