import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  interests: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
  }).index("by_name", ["name"]),

  profiles: defineTable({
    userId: v.string(),
    email: v.string(),
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
    isComplete: v.boolean(),
    isActive: v.boolean(),
    prefMinAge: v.optional(v.number()),
    prefMaxAge: v.optional(v.number()),
    prefGender: v.optional(v.union(v.literal("MALE"), v.literal("FEMALE"), v.literal("ALL"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_gender", ["gender"])
    .index("by_fakultas", ["fakultas"])
    .index("by_active_gender", ["isActive", "gender"]),

  swipes: defineTable({
    swiperId: v.id("profiles"),
    swipeeId: v.id("profiles"),
    action: v.union(v.literal("LIKE"), v.literal("DISLIKE")),
    createdAt: v.number(),
  })
    .index("by_swiper", ["swiperId"])
    .index("by_swipee", ["swipeeId"])
    .index("by_swiper_swipee", ["swiperId", "swipeeId"])
    .index("by_swiper_action", ["swiperId", "action"]),

  matches: defineTable({
    profile1Id: v.id("profiles"),
    profile2Id: v.id("profiles"),
    isSeenByProfile1: v.boolean(),
    isSeenByProfile2: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_profile1", ["profile1Id"])
    .index("by_profile2", ["profile2Id"])
    .index("by_profiles", ["profile1Id", "profile2Id"]),

  conversations: defineTable({
    matchId: v.id("matches"),
    participant1Id: v.id("profiles"),
    participant2Id: v.id("profiles"),
    lastMessagePreview: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
    participant1UnreadCount: v.number(),
    participant2UnreadCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_matchId", ["matchId"])
    .index("by_participant1", ["participant1Id"])
    .index("by_participant2", ["participant2Id"])
    .index("by_lastMessage", ["lastMessageAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("profiles"),
    encryptedContent: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("system")),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_created", ["conversationId", "createdAt"]),

  presence: defineTable({
    profileId: v.id("profiles"),
    lastSeen: v.number(),
  })
    .index("by_profileId", ["profileId"]),
});
