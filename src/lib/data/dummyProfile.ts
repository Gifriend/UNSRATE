// src/lib/data/dummyProfiles.ts
import type { Profile } from '$lib/types/explore'; // Pastikan path ini benar

export const MOCK_PROFILES: Profile[] = [
  {
    id: "user_1",
    name: "Sarah",
    fullname: "Sarah Amalia",
    age: 21,
    bio: "Anak DKV yang suka kopi dan begadang ngerjain tugas. Looking for study buddy! 🎨☕",
    gender: "FEMALE",
    fakultas: "Fakultas Seni Rupa & Desain",
    prodi: "Desain Komunikasi Visual",
    location: { city: "Bandung", distanceKm: 2.5 }, // Sesuaikan dengan tipe any
    matchScore: 85,
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"
    ],
    interests: [
      { id: "1", name: "Photography" },
      { id: "2", name: "Coffee" },
      { id: "3", name: "Art" }
    ]
  },
  {
    id: "user_2",
    name: "Dimas",
    fullname: "Dimas Pratama",
    age: 22,
    bio: "Mahasiswa Teknik yang jarang mandi tapi jago ngoding. Yuk mabar ML! 🎮💻",
    gender: "MALE",
    fakultas: "Fakultas Ilmu Komputer",
    prodi: "Teknik Informatika",
    location: { city: "Jakarta", distanceKm: 5.0 },
    matchScore: 92,
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop"
    ],
    interests: [
      { id: "4", name: "Coding" },
      { id: "5", name: "Gaming" },
      { id: "6", name: "Gym" }
    ]
  },
  {
    id: "user_3",
    name: "Jessica",
    fullname: "Jessica Tan",
    age: 20,
    bio: "Suka traveling dan kulineran. Swipe right kalau kamu tau tempat makan enak! 🍜✈️",
    gender: "FEMALE",
    fakultas: "Fakultas Ekonomi",
    prodi: "Manajemen",
    location: { city: "Surabaya", distanceKm: 12 },
    matchScore: 78,
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop"
    ],
    interests: [
      { id: "7", name: "Foodie" },
      { id: "8", name: "Traveling" }
    ]
  }
];