'use client';

import { useState, useEffect, useCallback } from 'react';
import SwipeCard from '@/components/SwipeCard';
import ActionButtons from '@/components/ActionButtons';
import Header from '@/components/Header';
import { Heart } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import { Profile } from '@/app/types/swipe';
import { api } from '@/app/services/api';

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

console.log('Rendering SwipePage', { currentIndex, profilesLength: profiles.length });

  useEffect(() => {
    console.log('useEffect triggered for fetching profiles');
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('discovery/feed');
        console.log('API response:', response.data);
        // Ensure profiles is an array to prevent issues with unexpected data
        const newProfiles = Array.isArray(response.data.profiles) ? response.data.profiles : [];
        setProfiles(newProfiles);
        setCurrentIndex(0); // Reset index when new profiles are fetched
        setError(null);
      } catch (err) {
        setError('Failed to load profiles. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = useCallback(
    async (action: 'LIKE' | 'DISLIKE') => {
      if (currentIndex >= profiles.length) return;

      const currentProfile = profiles[currentIndex];
      try {
        await api.post('swipes', {
          swipedUserId: currentProfile.id,
          action,
        });

        console.log(`${action} on ${currentProfile.name}`);

        setCurrentIndex((prev) => prev + 1);
      } catch (err) {
        console.error(`Failed to ${action.toLowerCase()} profile:`, err);
      }
    },
    [currentIndex, profiles]
  );

  const handleLike = useCallback(() => handleSwipe('LIKE'), [handleSwipe]);
  const handleDislike = useCallback(
    () => handleSwipe('DISLIKE'),
    [handleSwipe]
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="hidden md:block absolute -left-16 top-32 text-pink-200 ">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 0L120 60.8L184.8 60.8L132.4 98.4L152.4 159.2L100 121.6L47.6 159.2L67.6 98.4L15.2 60.8L80 60.8L100 0Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="hidden md:block absolute -right-16 top-1/4 text-pink-200 ">
        <svg
          width="240"
          height="240"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="hidden md:block absolute left-1/4 bottom-20 text-pink-200 ">
        <svg
          width="180"
          height="180"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="hidden md:block absolute right-1/4 bottom-40 text-pink-200 ">
        <svg
          width="120"
          height="120"
          viewBox="0 0 200 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>
      </div>

      {/* Additional decorative elements */}
      <div className="hidden md:block absolute left-1/3 top-40 text-pink-200">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="hidden md:block absolute right-1/3 top-60 text-pink-200 ">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <Header />

      <main className="container max-w-md mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <SkeletonCard />
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : currentIndex < profiles.length ? (
          <div className="space-y-6">
            <SwipeCard profile={profiles[currentIndex]} />
            <ActionButtons onDislike={handleDislike} onLike={handleLike} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4 bg-background rounded-3xl shadow-lg border p-8">
            <div className="rounded-full bg-muted p-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Tidak ada profil lagi</h2>
            <p className="text-muted-foreground max-w-xs">
              Kami sedang mencari lebih banyak orang yang cocok dengan Anda.
              Coba lagi nanti ya!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
