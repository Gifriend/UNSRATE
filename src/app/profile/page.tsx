"use client"
import { useState } from 'react';
import Header from '../../../components/Header';

// Definisi tipe untuk profil
interface UserProfile {
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Ahmad",
    age: 27,
    location: "Jakarta",
    bio: "Suka traveling dan musik",
    images: ["/profiles/ahmad1.jpg", "/profiles/ahmad2.jpg"]
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-60 bg-gray-300 relative">
            {/* Di sini harusnya gambar profil utama */}
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold">{profile.name}, {profile.age}</h1>
              <p className="text-sm">{profile.location}</p>
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="font-medium text-xl mb-2">Tentang Saya</h2>
            <p className="text-gray-600">{profile.bio}</p>
            
            <div className="mt-6">
              <h2 className="font-medium text-xl mb-2">Foto Saya</h2>
              <div className="grid grid-cols-3 gap-2">
                {profile.images.map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-300 rounded-md">
                    {/* Di sini harusnya gambar profil */}
                  </div>
                ))}
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="font-medium text-xl mb-2">Pengaturan</h2>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span>Jarak Maksimum</span>
                  <span>10 km</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span>Rentang Usia</span>
                  <span>21-35</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span>Cari</span>
                  <span>Semua</span>
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