"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import "@/app/assets/css/mobile-slider.css"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

export default function AuthSlider() {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

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
    setError(""); // Clear any errors when switching forms
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-pink-200 from-blue-50 to-pink-50 p-4 overflow-hidden">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border bg-white shadow-lg sm:max-w-lg md:max-w-4xl">
        {/* Error message display */}
        {error && (
          <div className="absolute top-4 left-0 right-0 mx-auto w-3/4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20">
            <p className="text-center text-sm">{error}</p>
          </div>
        )}
        
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
                <p className="mb-2 text-center text-muted-foreground text-black">Welcome back! Please login to your account</p>

                <LoginForm setError={setError} isMobile={true} />

                <div className="mt-8 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Dont have an account?</p>
                  <button
                    onClick={toggleForm}
                    className="inline-flex items-center justify-center rounded-md border border-pink-600 bg-transparent px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    disabled={isAnimating}
                  >
                    Sign Up
                  </button>
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

                <RegisterForm setError={setError} isMobile={true}  onRegisterSuccess={toggleForm}/>

                <div className="mt-8 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Already have an account?</p>
                  <button
                    onClick={toggleForm}
                    className="inline-flex items-center justify-center rounded-md border border-pink-600 bg-transparent px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    disabled={isAnimating}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop View (above 767px)
          <div className="flex h-[550px] flex-col md:flex-row overflow-hidden">
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

                <LoginForm setError={setError} isMobile={false} />
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
                <h2 className="mb-1 text-center text-3xl font-bold">Create Account</h2>
                <p className="mb-1 text-center text-muted-foreground">Sign up to get started with our service</p>

                <RegisterForm setError={setError} isMobile={false} onRegisterSuccess={toggleForm}/>
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
                <button 
                  className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  onClick={toggleForm}
                  disabled={isAnimating}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}