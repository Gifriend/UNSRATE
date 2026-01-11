import type { Id } from "../../convex/_generated/dataModel";

export interface ExploreProfile {
  _id: Id<"profiles">;
  fullname: string;
  nickname: string;
  age: number;
  bio: string;
  gender: "MALE" | "FEMALE";
  fakultas: string;
  prodi: string;
  photos: string[];
  interests: Array<{ id: Id<"interests">; name: string; icon?: string }>;
  matchScore: number;
}

export interface MatchResult {
  _id: Id<"matches">;
  matchedProfile: {
    _id: Id<"profiles">;
    fullname: string;
    photos: string[];
  } | null;
}

export interface SwipeResult {
  success: boolean;
  match: MatchResult | null;
}

export interface MatchedUser {
  matchId: Id<"matches">;
  matchedAt: number;
  profile: {
    _id: Id<"profiles">;
    fullname: string;
    nickname: string;
    photos: string[];
    bio: string;
  };
}