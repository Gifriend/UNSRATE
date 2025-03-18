"use client"
import { useState } from 'react';

// Definisi tipe untuk props
interface Profile {
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
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
        {/* Gambar placeholder, dalam implementasi nyata gunakan gambar asli */}
        <div className="absolute inset-0 bg-gray-300">
          {/* Di sini harusnya gambar profil */}
        </div>
        
        {/* Kontrol navigasi gambar */}
        <div className="absolute inset-x-0 top-0 h-full flex">
          <div className="w-1/2 h-full" onClick={prevImage}></div>
          <div className="w-1/2 h-full" onClick={nextImage}></div>
        </div>
        
        {/* Indikator gambar */}
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
        
        {/* Info profil */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <div className="flex items-end">
            <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
          </div>
          <p className="text-sm mt-1">{profile.location}</p>
          <p className="text-sm mt-2">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}