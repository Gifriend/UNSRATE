import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhotoUploadModal } from '@/components/photo-upload-modal';
import { Camera, Check, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast-context';
import { api } from '@/app/services/api';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/app/types/userProfileTypes';
import { AxiosError } from 'axios';

interface PhotosSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export default function PhotosSection({
  profile,
  setProfile,
}: PhotosSectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const { toast } = useToast();

  const refetchProfile = useCallback(async () => {
    try {
      const profileResponse = await api.get('users/profile');
      if (profileResponse.data.statusCode === 200) {
        setProfile(profileResponse.data.data);
      }
    } catch (error) {
      console.error('Error refetching profile:', error);
    }
  }, [setProfile]);

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit');
        }

        const formData = new FormData();
        formData.append('files', file); // Match backend expectation

        await api.patch('users/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await refetchProfile();

        toast({
          title: 'Success',
          description: 'Photo uploaded successfully',
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        let errorMessage = 'Unknown error';

        if (error instanceof AxiosError) {
          errorMessage =
            (error.response?.data as { message?: string })?.message ??
            error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: 'Error',
          description: `Failed to upload photo: ${errorMessage}`,
          variant: 'destructive',
        });
      }
    },
    [refetchProfile, toast]
  );

  const handleDeletePhoto = useCallback(
    async (photoUrl: string) => {
      try {
        await api.delete('users/photos', {
          data: { photoUrl }, // Send photoUrl in body
        });

        await refetchProfile();

        setActivePhotoIndex(null);
        setShowPhotoOptions(false);

        toast({
          title: 'Success',
          description: 'Photo deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete photo',
          variant: 'destructive',
        });
      }
    },
    [refetchProfile, toast]
  );

  const handleSetProfilePhoto = useCallback(
    async (photoUrl: string | null) => {
      try {
        await api.patch('users/photos', {
          profilePicture: photoUrl || null, // Send null instead of ""
        });

        await refetchProfile();

        setActivePhotoIndex(null);
        setShowPhotoOptions(false);

        toast({
          title: 'Success',
          description: 'Profile picture updated successfully',
        });
      } catch (error) {
        console.error('Error setting profile photo:', error);
        toast({
          title: 'Error',
          description: 'Failed to set profile photo',
          variant: 'destructive',
        });
      }
    },
    [refetchProfile, toast]
  );

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-medium text-lg md:text-xl">My Photos</h2>
          <PhotoUploadModal
            onSave={handlePhotoUpload}
            triggerButton={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:cursor-pointer">
                <Camera className="h-4 w-4" /> Add Photo
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {profile.profilePicture && (
            <div
              key="profile-picture"
              className="aspect-square bg-muted rounded-md relative overflow-hidden group"
              onClick={() => {
                setActivePhotoIndex(-1);
                setShowPhotoOptions(true);
              }}>
              <Image
                src={profile.profilePicture}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                Main
              </div>
            </div>
          )}

          {profile.Photos &&
            profile.Photos.filter(
              (photo) =>
                photo && typeof photo === 'string' && photo.trim() !== ''
            ).map((photo, index) => (
              <div
                key={photo} // Use photo URL as key
                className={cn(
                  'aspect-square bg-muted rounded-md relative overflow-hidden group',
                  activePhotoIndex === index && 'ring-2 ring-pink-500'
                )}
                onClick={() => {
                  setActivePhotoIndex(index);
                  setShowPhotoOptions(true);
                }}>
                <Image
                  src={photo} // Use photo directly
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

          <PhotoUploadModal
            key="upload-modal"
            onSave={handlePhotoUpload}
            triggerButton={
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:border-muted-foreground/40 transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            }
          />
        </div>

        {showPhotoOptions && activePhotoIndex !== null && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPhotoOptions(false)}>
            <div
              className="bg-background rounded-lg p-4 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="font-medium text-lg mb-4">Photo Options</h3>

              <div className="space-y-2">
                {activePhotoIndex >= 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      handleSetProfilePhoto(profile.Photos[activePhotoIndex])
                    }>
                    <Check className="h-4 w-4 mr-2" /> Set as profile photo
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    if (activePhotoIndex >= 0) {
                      handleDeletePhoto(profile.Photos[activePhotoIndex]); // Send URL
                    } else if (
                      activePhotoIndex === -1 &&
                      profile.profilePicture
                    ) {
                      handleSetProfilePhoto(null); // Remove profile picture
                    }
                  }}>
                  <X className="h-4 w-4 mr-2" />
                  {activePhotoIndex === -1
                    ? 'Remove profile photo'
                    : 'Delete photo'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPhotoOptions(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
