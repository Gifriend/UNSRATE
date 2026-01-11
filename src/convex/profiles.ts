import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!profile) return null;

    const photoUrls = await Promise.all(
      (profile.photos ?? []).map(async (photoId) => {
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
      ...profile,
      photos: photoUrls.filter(Boolean) as string[],
    };
  },
});

export const getProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return null;

    const photoUrls = await Promise.all(
      (profile.photos ?? []).map(async (photoId) => {
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
      ...profile,
      photos: photoUrls.filter(Boolean) as string[],
    };
  },
});

export const getProfileById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return null;

    const interestDocs = await ctx.db.query("interests").collect();
    const interestMap = new Map(interestDocs.map(i => [i._id.toString(), { _id: i._id, name: i.name, icon: i.icon }]));

    const interests = (profile.interests ?? [])
      .map(id => interestMap.get(id.toString()))
      .filter(Boolean);

    const photoUrls = await Promise.all(
      (profile.photos ?? []).map(async (photoId) => {
        if (photoId.startsWith('http')) return photoId;
        try {
          const url = await ctx.storage.getUrl(photoId as any);
          return url;
        } catch {
          return null;
        }
      })
    );

    const birth = new Date(profile.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return {
      ...profile,
      photos: photoUrls.filter(Boolean) as string[],
      age,
      interests,
    };
  },
});

export const createProfile = mutation({
  args: {
    fullname: v.string(),
    nickname: v.string(),
    birthDate: v.string(),
    gender: v.union(v.literal("MALE"), v.literal("FEMALE")),
    fakultas: v.string(),
    prodi: v.string(),
    angkatan: v.number(),
    bio: v.string(),
    photos: v.array(v.string()),
    interests: v.optional(v.array(v.id("interests"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const now = Date.now();
    const profileId = await ctx.db.insert("profiles", {
      userId: authUser._id,
      email: authUser.email,
      fullname: args.fullname,
      nickname: args.nickname,
      birthDate: args.birthDate,
      gender: args.gender,
      fakultas: args.fakultas,
      prodi: args.prodi,
      angkatan: args.angkatan,
      bio: args.bio,
      photos: args.photos,
      interests: args.interests,
      isComplete: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return profileId;
  },
});

export const updateProfile = mutation({
  args: {
    fullname: v.optional(v.string()),
    nickname: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("MALE"), v.literal("FEMALE"))),
    fakultas: v.optional(v.string()),
    prodi: v.optional(v.string()),
    angkatan: v.optional(v.number()),
    bio: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.id("interests"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!profile) {
      throw new Error("Profile not found");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.fullname !== undefined) updates.fullname = args.fullname;
    if (args.nickname !== undefined) updates.nickname = args.nickname;
    if (args.birthDate !== undefined) updates.birthDate = args.birthDate;
    if (args.gender !== undefined) updates.gender = args.gender;
    if (args.fakultas !== undefined) updates.fakultas = args.fakultas;
    if (args.prodi !== undefined) updates.prodi = args.prodi;
    if (args.angkatan !== undefined) updates.angkatan = args.angkatan;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.photos !== undefined) updates.photos = args.photos;
    if (args.interests !== undefined) updates.interests = args.interests;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});

export const checkProfileComplete = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return { hasProfile: false, isComplete: false };
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!profile) {
      return { hasProfile: false, isComplete: false };
    }

    return { hasProfile: true, isComplete: profile.isComplete };
  },
});
