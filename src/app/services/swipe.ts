import { Profile } from "@/app/types/swipe";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDiscoveryFeed = async (): Promise<Profile[]> => {
  const response = await fetch(`${API_URL}/discovery/feed`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch discovery feed");
  }

  return response.json();
};

export const createSwipe = async (swipedUserId: string, action: "LIKE" | "DISLIKE") => {
  const response = await fetch(`${API_URL}swipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ swipedUserId, action }),
  });

  if (!response.ok) {
    throw new Error("Failed to create swipe");
  }

  return response.json();
};