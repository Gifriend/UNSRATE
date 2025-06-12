'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '../services/api';

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const RefreshTokenClient = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  useEffect(() => {
    if (isAuthPage) return;

    const interval = setInterval(async () => {
      try {
        const refreshToken = getCookie('refresh_token');
        if (!refreshToken) throw new Error('Refresh token tidak ditemukan');

        const response = await api.post('/auth/refresh', null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = response.data.data.access_token;

        // Simpan access_token baru ke cookie
        document.cookie = `access_token=${newAccessToken}; path=/;`;

        console.log('Token refreshed!');
      } catch (error) {
        console.error('Gagal refresh token:', error);

        // Hapus cookies
        document.cookie = 'access_token=; Max-Age=0; path=/;';
        document.cookie = 'refresh_token=; Max-Age=0; path=/;';
        document.cookie = 'role=; Max-Age=0; path=/;';

        window.location.href = '/auth';
      }
    }, 30 * 60 * 1000); // 30 menit

    return () => clearInterval(interval);
  }, [isAuthPage]);

  return null;
};

export default RefreshTokenClient;
