"use client"
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';

// Definisi tipe untuk match
interface Match {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  image: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      name: "Dewi",
      lastMessage: "Halo, apa kabar?",
      timestamp: "10:30",
      image: "/profiles/dewi1.jpg"
    },
    {
      id: 2,
      name: "Budi",
      lastMessage: "Mau ngopi bareng?",
      timestamp: "Kemarin",
      image: "/profiles/budi1.jpg"
    },
    {
      id: 3,
      name: "Sinta",
      lastMessage: "Terima kasih untuk hari ini!",
      timestamp: "Kemarin",
      image: "/profiles/sinta1.jpg"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Pesan</h2>
        
        <div className="bg-white rounded-xl shadow">
          {matches.map(match => (
            <Link href={`/chat/${match.id}`} key={match.id}>
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  {/* Di sini harusnya gambar profil */}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{match.name}</h3>
                    <span className="text-xs text-gray-500">{match.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}