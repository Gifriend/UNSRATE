import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { decrypt } from "./lib/encryption";

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return [];

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return [];

    const conversationsAsP1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", myProfile._id))
      .collect();

    const conversationsAsP2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2Id", myProfile._id))
      .collect();

    const allConversations = [...conversationsAsP1, ...conversationsAsP2];

    const conversationsWithDetails = await Promise.all(
      allConversations.map(async (conv) => {
        const otherProfileId = conv.participant1Id === myProfile._id 
          ? conv.participant2Id 
          : conv.participant1Id;
        
        const otherProfile = await ctx.db.get(otherProfileId);
        if (!otherProfile) return null;

        let photoUrl = otherProfile.photos?.[0] || "";
        if (photoUrl && !photoUrl.startsWith("http")) {
          try {
            photoUrl = await ctx.storage.getUrl(photoUrl as any) || "";
          } catch {
            photoUrl = "";
          }
        }

        const presence = await ctx.db
          .query("presence")
          .withIndex("by_profileId", (q) => q.eq("profileId", otherProfileId))
          .unique();

        const isOnline = presence 
          ? Date.now() - presence.lastSeen < 60000 
          : false;

        const unreadCount = conv.participant1Id === myProfile._id
          ? conv.participant1UnreadCount
          : conv.participant2UnreadCount;

        return {
          _id: conv._id,
          matchId: conv.matchId,
          otherProfile: {
            _id: otherProfile._id,
            nickname: otherProfile.nickname,
            photo: photoUrl,
            isOnline,
          },
          lastMessagePreview: conv.lastMessagePreview 
            ? decrypt(conv.lastMessagePreview)
            : null,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      })
    );

    const validConversations = conversationsWithDetails.filter(
      (c): c is NonNullable<typeof c> => c !== null
    );

    return validConversations.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
  },
});

export const getOrCreateConversation = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");

    const existingConv = await ctx.db
      .query("conversations")
      .withIndex("by_matchId", (q) => q.eq("matchId", args.matchId))
      .unique();

    if (existingConv) return existingConv._id;

    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");

    const conversationId = await ctx.db.insert("conversations", {
      matchId: args.matchId,
      participant1Id: match.profile1Id,
      participant2Id: match.profile2Id,
      participant1UnreadCount: 0,
      participant2UnreadCount: 0,
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

export const getConversationById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return null;

    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return null;

    if (conv.participant1Id !== myProfile._id && conv.participant2Id !== myProfile._id) {
      return null;
    }

    const otherProfileId = conv.participant1Id === myProfile._id 
      ? conv.participant2Id 
      : conv.participant1Id;

    const otherProfile = await ctx.db.get(otherProfileId);
    if (!otherProfile) return null;

    let photoUrl = otherProfile.photos?.[0] || "";
    if (photoUrl && !photoUrl.startsWith("http")) {
      try {
        photoUrl = await ctx.storage.getUrl(photoUrl as any) || "";
      } catch {
        photoUrl = "";
      }
    }

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_profileId", (q) => q.eq("profileId", otherProfileId))
      .unique();

    const isOnline = presence 
      ? Date.now() - presence.lastSeen < 60000 
      : false;

    return {
      _id: conv._id,
      matchId: conv.matchId,
      myProfileId: myProfile._id,
      otherProfile: {
        _id: otherProfile._id,
        nickname: otherProfile.nickname,
        fullname: otherProfile.fullname,
        photo: photoUrl,
        isOnline,
      },
    };
  },
});

export const getTotalUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return 0;

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return 0;

    const conversationsAsP1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", myProfile._id))
      .collect();

    const conversationsAsP2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2Id", myProfile._id))
      .collect();

    let total = 0;
    
    for (const conv of conversationsAsP1) {
      total += conv.participant1UnreadCount;
    }
    
    for (const conv of conversationsAsP2) {
      total += conv.participant2UnreadCount;
    }

    return total;
  },
});
