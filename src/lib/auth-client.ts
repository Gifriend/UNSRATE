import { createAuthClient } from 'better-auth/svelte';
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  plugins: [convexClient()],
});