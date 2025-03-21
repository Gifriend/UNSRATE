"use client"
import { useState } from 'react';
import Header from '../components/Header';
import SwipeCard from '../components/SwipeCard';
import ActionButtons from '../components/ActionButtons';
import { StaticImageData } from 'next/image';
import mikel from '../assets/img/mikel.png';
import clarissa from '../assets/img/clarissa.jpg';
import mario from '../assets/img/mario.jpg';
import { Heart } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  images: (string | StaticImageData)[];
}

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const profiles: Profile[] = [
    {
      id: 1,
      name: "Mario Paat",
      age: 18,
      bio: "Saya suka matematika dan machine learning",
      images: [mario]
    },
    {
      id: 2,
      name: "Mikel",
      age: 21,
      bio: "Pencinta kopi dan musik",
      images: [mikel, ]
    },
    {
      id: 3,
      name: "Clarissa",
      age: 24,
      bio: "Foodie dan penikmat film",
      images: [clarissa]
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-md mx-auto px-4 py-6">
        {currentIndex < profiles.length ? (
          <div className="space-y-6">
            <SwipeCard profile={profiles[currentIndex]} />
            <ActionButtons onDislike={handleDislike} onLike={handleLike}  />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4 bg-background rounded-3xl shadow-lg border p-8">
            <div className="rounded-full bg-muted p-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Tidak ada profil lagi</h2>
            <p className="text-muted-foreground max-w-xs">
              Kami sedang mencari lebih banyak orang yang cocok dengan Anda. Coba lagi nanti ya!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
