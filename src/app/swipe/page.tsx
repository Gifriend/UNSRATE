"use client"
import { useState } from 'react';
import Header from '../../../components/Header';
import SwipeCard from '../../../components/SwipeCard';
import ActionButtons from '../../../components/ActionButtons';

// Mendefinisikan tipe untuk profil
interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
}

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Data pengguna dummy
  const profiles: Profile[] = [
    {
      id: 1,
      name: "Dewi",
      age: 25,
      location: "Jakarta",
      bio: "Suka traveling dan fotografi",
      images: ["/profiles/dewi1.jpg", "/profiles/dewi2.jpg"]
    },
    {
      id: 2,
      name: "Budi",
      age: 28,
      location: "Bandung",
      bio: "Pencinta kopi dan musik",
      images: ["/profiles/budi1.jpg", "/profiles/budi2.jpg"]
    },
    {
      id: 3,
      name: "Sinta",
      age: 24,
      location: "Surabaya",
      bio: "Foodie dan penikmat film",
      images: ["/profiles/sinta1.jpg"]
    }
  ];

  const handleLike = () => {
    console.log(`Liked ${profiles[currentIndex].name}`);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDislike = () => {
    console.log(`Disliked ${profiles[currentIndex].name}`);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSuperLike = () => {
    console.log(`Super Liked ${profiles[currentIndex].name}`);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {currentIndex < profiles.length ? (
          <>
            <SwipeCard profile={profiles[currentIndex]} />
            <ActionButtons 
              onDislike={handleDislike} 
              onLike={handleLike} 
              onSuperLike={handleSuperLike} 
            />
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">Tidak ada profil lagi</h2>
            <p className="text-gray-500 mt-2">Coba lagi nanti ya!</p>
          </div>
        )}
      </div>
    </div>
  );
}