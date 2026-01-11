import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

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

export const getMatches = query({
  args: {
    sortBy: v.optional(v.union(v.literal("recent"), v.literal("name"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return [];

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return [];

    const matchesAsProfile1 = await ctx.db
      .query("matches")
      .withIndex("by_profile1", (q) => q.eq("profile1Id", myProfile._id))
      .collect();

    const matchesAsProfile2 = await ctx.db
      .query("matches")
      .withIndex("by_profile2", (q) => q.eq("profile2Id", myProfile._id))
      .collect();

    const allMatches = [...matchesAsProfile1, ...matchesAsProfile2];

    const interestDocs = await ctx.db.query("interests").collect();
    const interestMap = new Map(interestDocs.map(i => [i._id.toString(), { _id: i._id, name: i.name, icon: i.icon ?? undefined }]));

    const normalizedMatches = await Promise.all(
      allMatches.map(async (match) => {
        const isProfile1 = match.profile1Id === myProfile._id;
        const partnerId = isProfile1 ? match.profile2Id : match.profile1Id;
        const isNew = isProfile1 ? !match.isSeenByProfile1 : !match.isSeenByProfile2;

        const partner = await ctx.db.get(partnerId);
        if (!partner || !partner.isActive) return null;

        const interests = (partner.interests ?? [])
          .map(id => interestMap.get(id.toString()))
          .filter(Boolean);

        return {
          _id: match._id,
          partnerId: partner._id,
          fullname: partner.fullname,
          nickname: partner.nickname,
          age: calculateAge(partner.birthDate),
          photos: partner.photos,
          fakultas: partner.fakultas,
          prodi: partner.prodi,
          bio: partner.bio,
          interests,
          isNew,
          createdAt: match.createdAt,
        };
      })
    );

    const validMatches = normalizedMatches.filter(Boolean);

    if (args.sortBy === "name") {
      validMatches.sort((a, b) => {
        const nameCompare = (a?.fullname ?? "").localeCompare(b?.fullname ?? "");
        if (nameCompare !== 0) return nameCompare;
        return (a?._id.toString() ?? "").localeCompare(b?._id.toString() ?? "");
      });
    } else {
      validMatches.sort((a, b) => {
        const timeCompare = (b?.createdAt ?? 0) - (a?.createdAt ?? 0);
        if (timeCompare !== 0) return timeCompare;
        return (a?._id.toString() ?? "").localeCompare(b?._id.toString() ?? "");
      });
    }

    return validMatches;
  },
});

export const getUnseenMatchCount = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return 0;

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return 0;

    const matchesAsProfile1 = await ctx.db
      .query("matches")
      .withIndex("by_profile1", (q) => q.eq("profile1Id", myProfile._id))
      .collect();

    const matchesAsProfile2 = await ctx.db
      .query("matches")
      .withIndex("by_profile2", (q) => q.eq("profile2Id", myProfile._id))
      .collect();

    let unseenCount = 0;

    for (const match of matchesAsProfile1) {
      if (!match.isSeenByProfile1) unseenCount++;
    }

    for (const match of matchesAsProfile2) {
      if (!match.isSeenByProfile2) unseenCount++;
    }

    return unseenCount;
  },
});

export const markMatchesAsSeen = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    const matchesAsProfile1 = await ctx.db
      .query("matches")
      .withIndex("by_profile1", (q) => q.eq("profile1Id", myProfile._id))
      .collect();

    const matchesAsProfile2 = await ctx.db
      .query("matches")
      .withIndex("by_profile2", (q) => q.eq("profile2Id", myProfile._id))
      .collect();

    for (const match of matchesAsProfile1) {
      if (!match.isSeenByProfile1) {
        await ctx.db.patch(match._id, { isSeenByProfile1: true });
      }
    }

    for (const match of matchesAsProfile2) {
      if (!match.isSeenByProfile2) {
        await ctx.db.patch(match._id, { isSeenByProfile2: true });
      }
    }

    return { success: true };
  },
});

export const unmatch = mutation({
  args: {
    matchId: v.id("matches"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");

    const isMyMatch = match.profile1Id === myProfile._id || match.profile2Id === myProfile._id;
    if (!isMyMatch) throw new Error("Unauthorized");

    const partnerId = match.profile1Id === myProfile._id ? match.profile2Id : match.profile1Id;

    const mySwipe = await ctx.db
      .query("swipes")
      .withIndex("by_swiper_swipee", (q) => 
        q.eq("swiperId", myProfile._id).eq("swipeeId", partnerId)
      )
      .unique();

    const theirSwipe = await ctx.db
      .query("swipes")
      .withIndex("by_swiper_swipee", (q) => 
        q.eq("swiperId", partnerId).eq("swipeeId", myProfile._id)
      )
      .unique();

    if (mySwipe) await ctx.db.delete(mySwipe._id);
    if (theirSwipe) await ctx.db.delete(theirSwipe._id);

    await ctx.db.delete(args.matchId);

    return { success: true };
  },
});
