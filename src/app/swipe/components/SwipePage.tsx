"use client";

import { useState, useEffect, useCallback } from "react";
import SwipeCard from "@/components/SwipeCard";
import ActionButtons from "@/components/ActionButtons";
import Header from "@/components/Header";
import { Heart } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import type { Profile, SwipeResponse, SwipeRequest } from "@/app/types/swipe";
import { api } from "@/app/services/api";
import canva1 from "@/app/assets/img/blurlove.png";
import NewCard from "@/components/NewCard";

import Image from "next/image";
export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);

  console.log("Rendering SwipePage", {
    currentIndex,
    profilesLength: profiles.length,
    hasFetchedMore,
    remainingProfiles: profiles.length - currentIndex,
  });

  // Initial fetch
  const fetchInitialProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get("discovery/feed");
      console.log("Initial API response:", response.data);

      const newProfiles = Array.isArray(response.data.profiles)
        ? response.data.profiles
        : [];
      setProfiles(newProfiles);
      setCurrentIndex(0);
      setHasFetchedMore(false); // Reset fetch flag for new batch
    } catch (err) {
      setError("Failed to load profiles. Please try again later.");
      console.error("Initial fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch more profiles
  const fetchMoreProfiles = useCallback(async () => {
    if (isFetchingMore || hasFetchedMore) return;

    try {
      setIsFetchingMore(true);
      console.log("Fetching more profiles...");

      const response = await api.get("discovery/feed");
      console.log("More profiles API response:", response.data);

      const newProfiles = Array.isArray(response.data.profiles)
        ? response.data.profiles
        : [];

      if (newProfiles.length > 0) {
        setProfiles((prev) => [...prev, ...newProfiles]);
        setHasFetchedMore(true); // Mark that we've fetched more for this batch
        console.log("Added more profiles:", newProfiles.length);
      }
    } catch (err) {
      console.error("Fetch more profiles error:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasFetchedMore]);

  // Initial load
  useEffect(() => {
    fetchInitialProfiles();
  }, [fetchInitialProfiles]);

  // Check if we need to fetch more profiles when currentIndex changes
  useEffect(() => {
    const remainingProfiles = profiles.length - currentIndex;

    console.log("Checking fetch condition:", {
      currentIndex,
      profilesLength: profiles.length,
      remainingProfiles,
      hasFetchedMore,
      isFetchingMore,
    });

    // Only fetch when we have 2 profiles left and haven't fetched more yet
    if (
      remainingProfiles <= 2 &&
      !hasFetchedMore &&
      !isFetchingMore &&
      profiles.length > 0
    ) {
      console.log("Triggering fetch more profiles");
      fetchMoreProfiles();
    }
  }, [
    currentIndex,
    profiles.length,
    hasFetchedMore,
    isFetchingMore,
    fetchMoreProfiles,
  ]);

  const handleSwipe = useCallback(
    async (action: "LIKE" | "DISLIKE") => {
      if (currentIndex >= profiles.length) return;

      const currentProfile = profiles[currentIndex];
      try {
        const swipeRequest: SwipeRequest = {
          swipedUserId: currentProfile.id,
          action,
        };

        const response = await api.post<SwipeResponse>("swipes", swipeRequest);
        console.log(`${action} on ${currentProfile.fullname}:`, response.data);

        // Check if there's a match
        if (response.data.match) {
          console.log("Match created!", response.data.match);
          // Here you could show a match notification
        }

        setCurrentIndex((prev) => prev + 1);
      } catch (err) {
        console.error(`Failed to ${action.toLowerCase()} profile:`, err);
      }
    },
    [currentIndex, profiles]
  );

  const handleLike = useCallback(() => handleSwipe("LIKE"), [handleSwipe]);
  const handleDislike = useCallback(
    () => handleSwipe("DISLIKE"),
    [handleSwipe]
  );

  // Reset fetch flag when we run out of profiles completely
  useEffect(() => {
    if (currentIndex >= profiles.length && profiles.length > 0) {
      console.log("Reached end of profiles, resetting fetch flag");
      setHasFetchedMore(false);
    }
  }, [currentIndex, profiles.length]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-background-grad">
      <div className="hidden md:block absolute -left-16 top-32  text-pink-200 ">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>
      <div className="hidden md:block absolute -right-16 top-1/4   text-pink-200  ">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
        {/* <svg
          width="240"
          height="240"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg> */}
      </div>
      <div className="hidden md:block absolute left-1/4  bottom-20 text-pink-200 ">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>
      <div className="hidden md:block absolute  right-1/5 bottom-35 text-pink-200 ">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>

      {/* Additional decorative elements */}
      <div className="hidden md:block absolute left-1/5 top-40  text-pink-200">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>
      <div className="hidden md:block absolute right-1/4 top-20  text-pink-200 ">
        <Image
          src={canva1}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>

      <Header />

      <main className="container max-w-md mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <SkeletonCard />
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchInitialProfiles}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        ) : currentIndex < profiles.length ? (
          <div className="space-y-6">
            <NewCard profile={profiles[currentIndex]} />
            {/* <SwipeCard profile={profiles[currentIndex]} /> */}
            {isFetchingMore && (
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full">
                  Mencari lebih banyak profil...
                </div>
              </div>
            )}
            <ActionButtons onDislike={handleDislike} onLike={handleLike} />

            {/* Debug info - remove in production */}
            {/* <div className="text-xs text-gray-500 text-center">
              {currentIndex + 1} / {profiles.length} | Remaining: {profiles.length - currentIndex}
            </div> */}
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
            <button
              onClick={fetchInitialProfiles}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-4"
            >
              Cari Lagi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
