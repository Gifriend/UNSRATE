import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const interests = await ctx.db
      .query("interests")
      .withIndex("by_name")
      .collect();
    return interests;
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("interests").first();
    if (existing) {
      return { success: false, message: "Interests already seeded" };
    }

    const defaultInterests = [
      { name: "Gaming", icon: "🎮" },
      { name: "Music", icon: "🎵" },
      { name: "Movies", icon: "🎬" },
      { name: "Anime", icon: "🎌" },
      { name: "K-Pop", icon: "🎤" },
      { name: "Photography", icon: "📸" },
      { name: "Art & Design", icon: "🎨" },
      { name: "Dancing", icon: "💃" },
      { name: "Traveling", icon: "✈️" },
      { name: "Cooking", icon: "🍳" },
      { name: "Coffee", icon: "☕" },
      { name: "Fashion", icon: "👗" },
      { name: "Sports", icon: "⚽" },
      { name: "Gym & Fitness", icon: "💪" },
      { name: "Hiking", icon: "🥾" },
      { name: "Reading", icon: "📚" },
      { name: "Coding & Tech", icon: "💻" },
      { name: "Pets & Animals", icon: "🐾" },
      { name: "Volunteering", icon: "🤝" },
      { name: "Foodie", icon: "🍜" },
    ];

    for (const interest of defaultInterests) {
      await ctx.db.insert("interests", interest);
    }

    return { success: true, message: `Seeded ${defaultInterests.length} interests` };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("interests")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      throw new Error(`Interest "${args.name}" already exists`);
    }

    const id = await ctx.db.insert("interests", {
      name: args.name,
      icon: args.icon,
    });

    return id;
  },
});
