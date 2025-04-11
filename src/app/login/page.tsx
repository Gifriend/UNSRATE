"use client"

import { useEffect, useState } from "react"
import { Mail, Lock, ArrowRight, User } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { cn } from "@/app/lib/utils"
import "@/app/assets/css/mobile-slider.css"
import Link from "next/link"

export default function AuthSlider() {
  const [isLogin, setIsLogin] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleForm = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsLogin(!isLogin);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-pink-200 from-blue-50 to-pink-50 p-4 overflow-hidden">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border bg-white shadow-lg sm:max-w-lg md:max-w-4xl">
        {/* Mobile View (767px and below) */}
        {isMobile ? (
          <div className="relative h-[600px] w-full overflow-hidden">
            {/* Login Form - Mobile */}
            <div
              className={cn(
                "absolute inset-0 w-full p-6 transition-all duration-700 ease-in-out",
                isLogin ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="mb-2 text-center text-3xl font-bold text-black">Sign In</h2>
                <p className="mb-6 text-center text-muted-foreground text-black">Welcome back! Please login to your account</p>

                <form className="space-y-4 w-full max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="email-login-mobile" className="text-black">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email-login-mobile" type="email" placeholder="m@example.com" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login-mobile" className="text-black">Password</Label>
                      {/* <Button variant="link" className="h-auto p-0 text-xs">
                        Forgot password?
                      </Button> */}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password-login-mobile" type="password" className="pl-10" />
                    </div>
                  </div>
                  <Link href="/dashboard">
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-700 text-white">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </form>

                <div className="mt-8 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Don't have an account?</p>
                  <Button
                    onClick={toggleForm}
                    variant="outline"
                    className="border-pink-600 text-pink-600 hover:bg-pink-50"
                    disabled={isAnimating}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>

            {/* Register Form - Mobile */}
            <div
              className={cn(
                "absolute inset-0 w-full p-6 transition-all duration-700 ease-in-out",
                isLogin ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="mb-2 text-center text-3xl font-bold text-black">Create Account</h2>
                <p className="mb-6 text-center text-muted-foreground text-black">Sign up to get started with our service</p>

                <form className="space-y-4 w-full max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="name-register-mobile" className="text-black">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="name-register-mobile" placeholder="John Doe" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-register-mobile" className="text-black">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email-register-mobile" type="email" placeholder="m@example.com" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-register-mobile" className="text-black">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password-register-mobile" type="password" className="pl-10" />
                    </div>
                  </div>

                  <Link href="/swipe">
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </form>

                <div className="mt-8 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Already have an account?</p>
                  <Button
                    onClick={toggleForm}
                    variant="outline"
                    className="border-pink-600 text-pink-600 hover:bg-pink-50"
                    disabled={isAnimating}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop View (above 767px)
          <div className="flex h-[500px] flex-col md:flex-row overflow-hidden">
            {/* Left Panel (Login) */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 md:order-1 relative overflow-hidden">
              <div
                className={cn(
                  "w-full max-w-sm transform transition-all duration-700 ease-in-out",
                  isLogin
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 md:absolute",
                )}
              >
                <h2 className="mb-2 text-center text-3xl font-bold">Sign In</h2>
                <p className="mb-6 text-center text-muted-foreground">Welcome back! Please login to your account</p>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-black">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email-login" type="email" placeholder="m@example.com" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login" className="text-black">Password</Label>
                      {/* <Button variant="link" className="h-auto p-0 text-xs">
                        Forgot password?
                      </Button> */}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password-login" type="password" className="pl-10" />
                    </div>
                  </div>

                  <Link href="/dashboard">
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </form>
              </div>
            </div>

            {/* Right Panel (Register) */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 md:order-3 relative overflow-hidden">
              <div
                className={cn(
                  "w-full max-w-sm transform transition-all duration-700 ease-in-out",
                  !isLogin
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0 md:absolute",
                )}
              >
                <h2 className="mb-2 text-center text-3xl font-bold">Create Account</h2>
                <p className="mb-6 text-center text-muted-foreground">Sign up to get started with our service</p>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-register" className="text-black">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="name-register" placeholder="John Doe" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-register" className="text-black">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email-register" type="email" placeholder="m@example.com" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-register" className="text-black">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password-register" type="password" className="pl-10" />
                    </div>
                  </div>

                  <Link href="/swipe">
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </form>
              </div>
            </div>

            {/* Middle Slider Panel */}
            <div
              className={cn(
                "absolute flex flex-col items-center justify-center p-8 text-center text-white transition-all duration-700 ease-in-out z-10",
                "md:w-1/2 w-full md:h-full h-1/2",
                isLogin
                  ? "md:right-0 md:translate-x-0 bottom-0 translate-y-0 rounded-l-3xl bg-pink-600 slider-panel"
                  : "md:left-0 md:translate-x-0 top-0 translate-y-0 rounded-r-3xl bg-pink-600 slider-panel",
              )}
            >
              <div className="max-w-xs transition-all duration-700 ease-in-out">
                <h2 className="mb-2 text-3xl font-bold">{isLogin ? "New here?" : "Already have an account?"}</h2>
                <p className="mb-6">
                  {isLogin
                    ? "Sign up now to begin your journey with us!"
                    : "Sign in to access your account and continue your journey."}
                </p>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10" 
                  onClick={toggleForm}
                  disabled={isAnimating}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
