import { authClient } from '$lib/auth-client';
import { goto } from '$app/navigation';

export async function logout(redirectTo: string = '/login') {
  try {
    await authClient.signOut();
    await goto(redirectTo, { replaceState: true, invalidateAll: true });
  } catch (error) {
    console.error('Logout failed:', error);
    await goto(redirectTo, { replaceState: true });
  }
}

export function needsOnboarding(user: any): boolean {
  if (!user) return false;
  // Tambahkan logic onboarding di sini
  // Misal: return !user.fakultas || !user.prodi;
  return false;
}

export const PROTECTED_ROUTES = ['/explore', '/chat', '/user', '/settings'];
export const PUBLIC_ROUTES = ['/login', '/'];
export const AUTH_REDIRECT = '/explore';
export const LOGIN_REDIRECT = '/login';
