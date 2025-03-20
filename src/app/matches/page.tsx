"use client"
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import mikel from '../assets/img/mikel.png';
import mario from '../assets/img/mario.jpg';
import clarissa from '../assets/img/clarissa.jpg';
import { StaticImageData } from 'next/image';


interface Match {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  image: (string | StaticImageData)[];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      name: "Mario",
      lastMessage: "Halo, apa kabar?",
      timestamp: "10:30",
      image: [mario]
    },
    {
      id: 2,
      name: "Mikel",
      lastMessage: "Mau ngopi bareng?",
      timestamp: "Kemarin",
      image: [mikel]
    },
    {
      id: 3,
      name: "Clarissa",
      lastMessage: "Terima kasih untuk hari ini!",
      timestamp: "Kemarin",
      image: [clarissa]
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-black">Pesan</h2>
        
        <div className="bg-white rounded-xl shadow">
          {matches.map(match => (
            <Link href={`/chat/${match.id}`} key={match.id}>
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img src="" alt="" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-pink-500">{match.name}</h3>
                    <span className="text-xs text-pink-500">{match.timestamp}</span>
                  </div>
                  <p className="text-sm text-pink-500 truncate">{match.lastMessage}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}