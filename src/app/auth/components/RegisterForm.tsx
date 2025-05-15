"use client"

import { useState } from "react"
import { Mail, Lock, ArrowRight, User, Fingerprint } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import { useRouter } from "next/navigation"
import axios from "axios"
import { api } from "@/app/services/api"

interface RegisterFormProps {
  setError: (error: string) => void;
  isMobile: boolean;
  onRegisterSuccess: () => void;
}

interface RegisterData {
  fullname: string;
  nim: string;
  email: string;
  password: string;
  age: string;
  verified: boolean;
}

// interface RegisterResponse {
//   token: {
//     access_token: string;
//     refresh_token: string;
//   };
//   user: {
//     id: string;
//     nim: string,
//     email: string;
//     name: string;
//     verified: boolean;
//   };
// }

export default function RegisterForm({ setError, isMobile, onRegisterSuccess }: RegisterFormProps) {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [registerData, setRegisterData] = useState<RegisterData>({
    fullname: "",
    nim : "",
    email: "",
    age: "",
    password: "",
    verified: false
  })

  // Handle input changes for register form
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData({
      ...registerData,
      [id.replace(`name-register${isMobile ? '-mobile' : ''}`, "fullname")
         .replace(`email-register${isMobile ? '-mobile' : ''}`, "email")
         .replace(`nim-register${isMobile ? '-mobile' : ''}`, "nim")
         .replace(`age-register${isMobile ? '-mobile' : ''}`, "age")
         .replace(`password-register${isMobile ? '-mobile' : ''}`, "password")]: value
    });
  }

  // Handle registration submission
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.post('/auth/register', registerData);
    
      if (response.status === 200 || response.status === 201) {
        const tokenData = response.data.token;
    
        if (tokenData?.access_token && tokenData?.refresh_token) {
          document.cookie = `access_token=${tokenData.access_token}; path=/;`;
          document.cookie = `refresh_token=${tokenData.refresh_token}; path=/;`;
    
          // window.location.href = '/swipe';
          onRegisterSuccess(); 
        } else {
          setError("Registrasi berhasil tetapi token tidak tersedia.");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError("Pengguna dengan NIM atau email ini sudah terdaftar.");
        } else {
          setError(error.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
        }
      } else {
        setError("Terjadi kesalahan tak terduga saat registrasi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const suffix = isMobile ? '-mobile' : '';

  return (
    <form className="space-y-4 w-full max-w-sm" onSubmit={handleRegister}>
      <div className="space-y-1">
        <Label htmlFor={`name-register${suffix}`} className="text-black">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id={`name-register${suffix}`}
            placeholder="John Doe" 
            className="pl-10"
            value={registerData.fullname}
            onChange={handleRegisterChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`nim-register${suffix}`} className="text-black">NIM</Label>
        <div className="relative">
          <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id={`nim-register${suffix}`}
            placeholder="21200123" 
            className="pl-10"
            value={registerData.nim}
            type="number"
            onChange={handleRegisterChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`email-register${suffix}`} className="text-black">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id={`email-register${suffix}`}
            type="email" 
            placeholder="m@example.com" 
            className="pl-10"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`email-register${suffix}`} className="text-black">Age</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id={`age-register${suffix}`}
            type="age" 
            placeholder="18" 
            className="pl-10"
            value={registerData.age}
            onChange={handleRegisterChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`password-register${suffix}`} className="text-black">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id={`password-register${suffix}`}
            type="password" 
            className="pl-10"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  )
}