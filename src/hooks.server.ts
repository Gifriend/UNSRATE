import { i18n } from '$lib/i18n'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle } from "@sveltejs/kit";
import { createAuth } from "$convex/auth";
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';

const authHandle: Handle = async ({ event, resolve }) => {
  event.locals.token = await getToken(createAuth, event.cookies);

  return resolve(event);
};

export const handle = sequence(i18n.handle(), authHandle)