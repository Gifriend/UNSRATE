'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { useRouter } from "next/navigation"
import axios from 'axios';
import { api } from '@/app/services/api';

interface LoginFormProps {
  setError: (error: string) => void;
  isMobile: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// interface LoginResponse {
//   access_token: string;
//   refresh_token: string;
//   user: {
//     id: string;
//     email: string;
//     name?: string;
//   };
// }

export default function LoginForm({ setError, isMobile }: LoginFormProps) {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // Handle input changes for login form
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData({
      ...loginData,
      [id
        .replace(`email-login${isMobile ? '-mobile' : ''}`, 'email')
        .replace(`password-login${isMobile ? '-mobile' : ''}`, 'password')]:
        value,
    });
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('auth/login', loginData);
      const payload = response.data;

      if (response.status === 200 || response.status === 201) {
        const accessToken = payload.data.access_token;
        const refreshToken = payload.data.refresh_token;

        document.cookie = `access_token=${accessToken}; path=/; `;
        document.cookie = `refresh_token=${refreshToken}; path=/; `;
        window.location.href = '/profile';
        // Router.push('/profile');
      }
      if (response.status == 400) {
        setError('Login failed. Please check your details and try again.');
      }
      if (response.status == 401) {
        setError('Unauthorized - Invalid credentials');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Login failed. Please check your credentials.'
        );
      } else {
        setError(`An unexpected error occurred during login. ${error}` ,);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const suffix = isMobile ? '-mobile' : '';

  return (
    <form className="space-y-4 w-full max-w-sm" onSubmit={handleLogin}>
      <div className="space-y-2">
        <Label htmlFor={`email-login${suffix}`} className="text-black">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id={`email-login${suffix}`}
            type="email"
            placeholder="m@example.com"
            className="pl-10"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`password-login${suffix}`} className="text-black">
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id={`password-login${suffix}`}
            type="password"
            className="pl-10"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
