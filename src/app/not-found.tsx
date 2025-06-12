"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Home, ArrowLeft, Search, MessageCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-8 w-24 h-24 bg-rose-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-pink-300 rounded-full opacity-25"></div>
        <div className="absolute bottom-16 right-1/3 w-20 h-20 bg-rose-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* 404 Icon */}
            <div className="mb-6 relative">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-15 w-5 text-white animate-pulse" />
              </div>
              <div className="text-6xl font-bold text-pink-500 absolute -top-2 left-1/2 transform -translate-x-1/2 -z-10">
                404
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Halaman Tidak Ditemukan</h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Sepertinya halaman yang Anda cari sudah tidak ada atau telah dipindahkan. Jangan khawatir, mari kembali
              mencari cinta! 💕
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/swipe">
                  <Button variant="outline" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Cari Match
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Pesan
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Sebelumnya
              </Button>
            </div>

            {/* Fun message */}
            <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-100">
              <p className="text-sm text-pink-700">
                <Heart className="h-4 w-4 inline mr-1" />
                &quot;Kadang tersesat itu perlu, supaya kita tahu jalan pulang yang benar&quot;
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
