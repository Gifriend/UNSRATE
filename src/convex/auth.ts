import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel.d";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import { createAuthMiddleware, APIError } from "better-auth/api";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";
const VALID_EMAIL_DOMAIN = "@student.unsrat.ac.id";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      "https://spotted-crocodile-895.convex.site",
      "http://localhost:5173"
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // Validasi email domain saat callback dari Google OAuth
        if (ctx.path === "/callback/google") {
          return; // Biarkan callback berjalan, validasi di after hook
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        // Setelah OAuth callback, cek email user
        if (ctx.path === "/callback/google" && ctx.context?.user) {
          const user = ctx.context.user;
          if (!user.email) {
            throw new APIError("BAD_REQUEST", {
              message: "Email tidak ditemukan",
            });
          }
          if (!user.email.toLowerCase().endsWith(VALID_EMAIL_DOMAIN)) {
            throw new APIError("FORBIDDEN", {
              message: `Hanya email ${VALID_EMAIL_DOMAIN} yang diizinkan. Email kamu: ${user.email}`,
            });
          }
        }
      }),
    },
    plugins: [
      convex({ authConfig }),
    ],
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});