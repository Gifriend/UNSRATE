import Image from "next/image"
import { UserProfile } from "@/app/types/userProfileTypes"

interface ProfileHeaderProps {
  profile: UserProfile
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative mb-6 md:mb-10">
      <div className="h-40 md:h-60 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
      <div className="absolute top-28 left-4 md:top-40 md:left-10 rounded-full border-4 border-background bg-muted h-24 w-24 md:h-40 md:w-40 overflow-hidden">
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
        
        {profile.missingFields && profile.missingFields.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <h3 className="font-medium text-sm mb-1">Complete your profile</h3>
            <p className="text-xs">
              Missing information: {profile.missingFields.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}