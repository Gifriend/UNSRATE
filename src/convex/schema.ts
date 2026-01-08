import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILES TABLE
  // Extended user data untuk dating app UNSRATE
  // Relasi: userId -> Better Auth user.id
  // ═══════════════════════════════════════════════════════════════════════════
  profiles: defineTable({
    // ─── Relasi ke Better Auth ───
    userId: v.string(),
    email: v.string(),

    // ─── Basic Info (Required saat onboarding) ───
    fullname: v.string(),
    nickname: v.string(),
    birthDate: v.string(),
    gender: v.union(v.literal("MALE"), v.literal("FEMALE")),

    // ─── Academic Info (UNSRAT specific) ───
    fakultas: v.string(),
    prodi: v.string(),
    angkatan: v.number(),

    // ─── Profile Content ───
    bio: v.string(),
    photos: v.array(v.string()),

    // ─── Optional ───
    interests: v.optional(v.array(v.string())),

    // ─── Status Flags ───
    isComplete: v.boolean(),
    isActive: v.boolean(),

    // ─── Timestamps ───
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_gender", ["gender"])
    .index("by_fakultas", ["fakultas"])
    .index("by_active_gender", ["isActive", "gender"]),
});
