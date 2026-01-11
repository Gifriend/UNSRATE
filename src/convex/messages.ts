import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { encrypt, decrypt, encryptPreview } from "./lib/encryption";

export const getMessages = query({
  args: { 
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return { messages: [], hasMore: false };

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) return { messages: [], hasMore: false };

    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return { messages: [], hasMore: false };

    if (conv.participant1Id !== myProfile._id && conv.participant2Id !== myProfile._id) {
      return { messages: [], hasMore: false };
    }

    const limit = args.limit || 50;

    let messagesQuery = ctx.db
      .query("messages")
      .withIndex("by_conversation_created", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .order("desc");

    if (args.cursor) {
      messagesQuery = ctx.db
        .query("messages")
        .withIndex("by_conversation_created", (q) => 
          q.eq("conversationId", args.conversationId).lt("createdAt", args.cursor!)
        )
        .order("desc");
    }

    const messages = await messagesQuery.take(limit + 1);
    const hasMore = messages.length > limit;
    const messagesToReturn = hasMore ? messages.slice(0, limit) : messages;

    const decryptedMessages = messagesToReturn.map((msg) => ({
      _id: msg._id,
      senderId: msg.senderId,
      content: decrypt(msg.encryptedContent),
      type: msg.type,
      readAt: msg.readAt,
      createdAt: msg.createdAt,
      isMe: msg.senderId === myProfile._id,
    }));

    return {
      messages: decryptedMessages.reverse(),
      hasMore,
      nextCursor: hasMore ? messagesToReturn[messagesToReturn.length - 1].createdAt : null,
    };
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("image"), v.literal("system"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    const conv = await ctx.db.get(args.conversationId);
    if (!conv) throw new Error("Conversation not found");

    if (conv.participant1Id !== myProfile._id && conv.participant2Id !== myProfile._id) {
      throw new Error("Not a participant");
    }

    const now = Date.now();
    const encryptedContent = encrypt(args.content);

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: myProfile._id,
      encryptedContent,
      type: args.type || "text",
      createdAt: now,
    });

    const isParticipant1 = conv.participant1Id === myProfile._id;

    await ctx.db.patch(args.conversationId, {
      lastMessagePreview: encryptPreview(args.content, 50),
      lastMessageAt: now,
      ...(isParticipant1 
        ? { participant2UnreadCount: conv.participant2UnreadCount + 1 }
        : { participant1UnreadCount: conv.participant1UnreadCount + 1 }
      ),
    });

    return messageId;
  },
});

export const markMessagesAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");

    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (!myProfile) throw new Error("Profile not found");

    const conv = await ctx.db.get(args.conversationId);
    if (!conv) throw new Error("Conversation not found");

    if (conv.participant1Id !== myProfile._id && conv.participant2Id !== myProfile._id) {
      throw new Error("Not a participant");
    }

    const isParticipant1 = conv.participant1Id === myProfile._id;
    const now = Date.now();

    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => 
        q.and(
          q.neq(q.field("senderId"), myProfile._id),
          q.eq(q.field("readAt"), undefined)
        )
      )
      .collect();

    for (const msg of unreadMessages) {
      await ctx.db.patch(msg._id, { readAt: now });
    }

    await ctx.db.patch(args.conversationId, {
      ...(isParticipant1 
        ? { participant1UnreadCount: 0 }
        : { participant2UnreadCount: 0 }
      ),
    });

    return unreadMessages.length;
  },
});

export const sendSystemMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) throw new Error("Conversation not found");

    const now = Date.now();
    const encryptedContent = encrypt(args.content);

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: conv.participant1Id,
      encryptedContent,
      type: "system",
      createdAt: now,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessagePreview: encryptPreview(args.content, 50),
      lastMessageAt: now,
    });
  },
});
