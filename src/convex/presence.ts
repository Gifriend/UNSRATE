import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const ONLINE_THRESHOLD_MS = 60000;

export const heartbeat = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return;

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return;

    const existingPresence = await ctx.db
      .query("presence")
      .withIndex("by_profileId", (q) => q.eq("profileId", myProfile._id))
      .unique();

    const now = Date.now();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, { lastSeen: now });
    } else {
      await ctx.db.insert("presence", {
        profileId: myProfile._id,
        lastSeen: now,
      });
    }
  },
});

export const isOnline = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .unique();

    if (!presence) return false;

    return Date.now() - presence.lastSeen < ONLINE_THRESHOLD_MS;
  },
});

export const getPresenceForProfiles = query({
  args: { profileIds: v.array(v.id("profiles")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const result: Record<string, boolean> = {};

    for (const profileId of args.profileIds) {
      const presence = await ctx.db
        .query("presence")
        .withIndex("by_profileId", (q) => q.eq("profileId", profileId))
        .unique();

      result[profileId] = presence 
        ? now - presence.lastSeen < ONLINE_THRESHOLD_MS 
        : false;
    }

    return result;
  },
});
