import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = getCookieValue("access_token");
      if (token){
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getCookieValue = (name: string): string | null => {
  if (typeof window === "undefined") return null; 
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue]= cookie.split("=").map(c => c.trim());
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};