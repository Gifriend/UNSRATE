"use client"
import { StaticImageData } from 'next/image';
import { useState } from 'react';
import Image  from 'next/image';

interface Profile {
  name: string;
  age: number;
  bio: string;
  images: (string | StaticImageData)[];
}

interface SwipeCardProps {
  profile: Profile;
}

export default function SwipeCard({ profile }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const nextImage = () => {
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto h-96 bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gray-300">
          <Image 
            src={profile.images[currentImageIndex]} 
            alt={`Foto ${profile.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="absolute inset-x-0 top-0 h-full flex">
          <div className="w-1/2 h-full" onClick={prevImage}></div>
          <div className="w-1/2 h-full" onClick={nextImage}></div>
        </div>
        
        <div className="absolute top-2 inset-x-0">
          <div className="flex space-x-1 px-2">
            {profile.images.map((_, index) => (
              <div 
                key={index} 
                className={`h-1 flex-1 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-pink">
          <div className="flex items-end">
            <h3 className="text-2xl font-bold text-pink">{profile.name}, {profile.age}</h3>
          </div>
          <p className="text-sm mt-2 text-pink">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}