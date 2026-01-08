import type { LayoutServerLoad } from "./$types";
import { createAuth } from "$convex/auth";
import { getAuthState } from "@mmailaender/convex-better-auth-svelte/sveltekit";

export const load: LayoutServerLoad = async ({ cookies }) => {
	try {
		const authState = await getAuthState(createAuth, cookies);
		return { authState };
	} catch (error) {
		console.warn("[Auth] Failed to get session, treating as unauthenticated:", error);
		return { 
			authState: {
				isAuthenticated: false,
				isLoading: false,
				user: null,
				session: null
			}
		};
	}
};
