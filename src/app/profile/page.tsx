"use client"
import { useState } from 'react';
import Header from '../../../components/Header';
import satria from '../assets/img/satria.jpg';
import satria2 from '../assets/img/satria1.jpg';
import satria3 from '../assets/img/satria2.jpg';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

// Definisi tipe untuk profil
interface UserProfile {
  name: string;
  age: number;
  bio: string;
  images: (string | StaticImageData)[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Satrian Amu",
    age: 21,
    bio: "Pria yang Lucu, Asik, Menyenangkan dan suka Coding",
    images: [satria, satria2, satria3]
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-60 bg-gray-300 relative">
          <Image 
            src={profile.images[0]} 
            alt="Foto Profil" 
            fill 
            className="object-contain"
          />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold text-black">{profile.name}, {profile.age}</h1>
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="font-medium text-xl mb-2 text-black">Tentang Saya</h2>
            <p className="text-black">{profile.bio}</p>
            
            <div className="mt-6">
              <h2 className="font-medium text-xl mb-2 text-black">Foto Saya</h2>
              <div className="grid grid-cols-3 gap-2">
              {profile.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-300 rounded-md relative">
                    <Image 
                      src={image} 
                      alt={`Foto ${index + 1}`} 
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-2xl text-black">+</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition">
              Edit Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}