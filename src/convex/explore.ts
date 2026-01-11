import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const DISLIKE_REFRESH_DAYS = 20;

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function calculateMatchScore(
  userInterests: string[],
  matchInterests: string[],
  userFakultas: string,
  matchFakultas: string,
  userProdi: string,
  matchProdi: string
): number {
  const userSet = new Set(userInterests);
  const matchSet = new Set(matchInterests);
  
  const intersection = [...userSet].filter(x => matchSet.has(x)).length;
  const union = new Set([...userSet, ...matchSet]).size;
  
  const jaccardSimilarity = union > 0 ? intersection / union : 0;
  let score = 40 + (jaccardSimilarity * 100) * 0.6;
  
  if (userFakultas === matchFakultas) {
    score += 10;
    if (userProdi === matchProdi) {
      score += 5;
    }
  }
  
  return Math.min(Math.round(score), 100);
}

export const getExploreProfiles = query({
  args: {
    limit: v.optional(v.number()),
    _key: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return [];

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return [];

    const limit = args.limit ?? 10;
    const now = Date.now();
    const refreshThreshold = now - (DISLIKE_REFRESH_DAYS * 24 * 60 * 60 * 1000);

    const mySwipes = await ctx.db
      .query("swipes")
      .withIndex("by_swiper", (q) => q.eq("swiperId", myProfile._id))
      .collect();

    const excludedIds = new Set<string>();
    excludedIds.add(myProfile._id as unknown as string);

    for (const swipe of mySwipes) {
      if (swipe.action === "LIKE") {
        excludedIds.add(swipe.swipeeId as unknown as string);
      } else if (swipe.action === "DISLIKE" && swipe.createdAt > refreshThreshold) {
        excludedIds.add(swipe.swipeeId as unknown as string);
      }
    }

    const matchesAsProfile1 = await ctx.db
      .query("matches")
      .withIndex("by_profile1", (q) => q.eq("profile1Id", myProfile._id))
      .collect();

    const matchesAsProfile2 = await ctx.db
      .query("matches")
      .withIndex("by_profile2", (q) => q.eq("profile2Id", myProfile._id))
      .collect();

    for (const match of matchesAsProfile1) {
      excludedIds.add(match.profile2Id as unknown as string);
    }
    for (const match of matchesAsProfile2) {
      excludedIds.add(match.profile1Id as unknown as string);
    }

    const targetGender = myProfile.prefGender === "ALL" 
      ? undefined 
      : myProfile.prefGender ?? (myProfile.gender === "MALE" ? "FEMALE" : "MALE");

    let allProfiles;
    if (targetGender) {
      allProfiles = await ctx.db
        .query("profiles")
        .withIndex("by_active_gender", (q) => 
          q.eq("isActive", true).eq("gender", targetGender)
        )
        .collect();
    } else {
      allProfiles = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }

    const myInterests = myProfile.interests ?? [];
    const minAge = myProfile.prefMinAge ?? 17;
    const maxAge = myProfile.prefMaxAge ?? 35;

    const interestDocs = await ctx.db.query("interests").collect();
    const interestMap = new Map(interestDocs.map(i => [i._id.toString(), { _id: i._id, name: i.name, icon: i.icon ?? undefined }]));

    const scoredProfiles = await Promise.all(
      allProfiles
        .filter(p => !excludedIds.has(p._id as unknown as string))
        .map(async (p) => {
          const age = calculateAge(p.birthDate);
          if (age < minAge || age > maxAge) return null;

          const myInterestIds = myInterests.map(id => id.toString());
          const pInterestIds = (p.interests ?? []).map(id => id.toString());

          const matchScore = calculateMatchScore(
            myInterestIds,
            pInterestIds,
            myProfile.fakultas,
            p.fakultas,
            myProfile.prodi,
            p.prodi
          );

          const interests = (p.interests ?? [])
            .map(id => interestMap.get(id.toString()))
            .filter(Boolean);

          const photoUrls = await Promise.all(
            (p.photos ?? []).map(async (photoId) => {
              if (photoId.startsWith('http')) return photoId;
              try {
                const url = await ctx.storage.getUrl(photoId as any);
                return url;
              } catch {
                return null;
              }
            })
          );

          return {
            _id: p._id,
            fullname: p.fullname,
            nickname: p.nickname,
            age,
            bio: p.bio,
            gender: p.gender,
            fakultas: p.fakultas,
            prodi: p.prodi,
            photos: photoUrls.filter(Boolean) as string[],
            interests,
            matchScore,
          };
        })
    );

    return scoredProfiles
      .filter(Boolean)
      .sort((a, b) => (b?.matchScore ?? 0) - (a?.matchScore ?? 0))
      .slice(0, limit);
  },
});

export const swipe = mutation({
  args: {
    swipeeId: v.id("profiles"),
    action: v.union(v.literal("LIKE"), v.literal("DISLIKE")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    if (myProfile._id === args.swipeeId) {
      throw new Error("Cannot swipe on yourself");
    }

    const existingSwipe = await ctx.db
      .query("swipes")
      .withIndex("by_swiper_swipee", (q) => 
        q.eq("swiperId", myProfile._id).eq("swipeeId", args.swipeeId)
      )
      .unique();

    if (existingSwipe) {
      await ctx.db.patch(existingSwipe._id, {
        action: args.action,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.insert("swipes", {
        swiperId: myProfile._id,
        swipeeId: args.swipeeId,
        action: args.action,
        createdAt: Date.now(),
      });
    }

    let match = null;
    if (args.action === "LIKE") {
      const theirSwipe = await ctx.db
        .query("swipes")
        .withIndex("by_swiper_swipee", (q) => 
          q.eq("swiperId", args.swipeeId).eq("swipeeId", myProfile._id)
        )
        .unique();

      if (theirSwipe?.action === "LIKE") {
        const existingMatch = await ctx.db
          .query("matches")
          .withIndex("by_profile1", (q) => q.eq("profile1Id", myProfile._id))
          .filter((q) => q.eq(q.field("profile2Id"), args.swipeeId))
          .unique();

        const existingMatchReverse = await ctx.db
          .query("matches")
          .withIndex("by_profile1", (q) => q.eq("profile1Id", args.swipeeId))
          .filter((q) => q.eq(q.field("profile2Id"), myProfile._id))
          .unique();

        if (!existingMatch && !existingMatchReverse) {
          const matchId = await ctx.db.insert("matches", {
            profile1Id: myProfile._id,
            profile2Id: args.swipeeId,
            isSeenByProfile1: true,
            isSeenByProfile2: false,
            createdAt: Date.now(),
          });

          const matchedProfile = await ctx.db.get(args.swipeeId);
          
          let matchedPhotoUrls: string[] = [];
          if (matchedProfile?.photos) {
            matchedPhotoUrls = (await Promise.all(
              matchedProfile.photos.map(async (photoId) => {
                if (photoId.startsWith('http')) return photoId;
                try {
                  const url = await ctx.storage.getUrl(photoId as any);
                  return url;
                } catch {
                  return null;
                }
              })
            )).filter(Boolean) as string[];
          }

          match = {
            _id: matchId,
            matchedProfile: matchedProfile ? {
              _id: matchedProfile._id,
              fullname: matchedProfile.fullname,
              photos: matchedPhotoUrls,
            } : null,
          };
        }
      }
    }

    return { success: true, match };
  },
});

export const updatePreferences = mutation({
  args: {
    prefMinAge: v.optional(v.number()),
    prefMaxAge: v.optional(v.number()),
    prefGender: v.optional(v.union(v.literal("MALE"), v.literal("FEMALE"), v.literal("ALL"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    await ctx.db.patch(myProfile._id, {
      prefMinAge: args.prefMinAge,
      prefMaxAge: args.prefMaxAge,
      prefGender: args.prefGender,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
