"use client"

import { X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onDislike: () => void
  onLike: () => void
  disabled?: boolean
}

export default function ActionButtons({ onDislike, onLike, disabled = false }: ActionButtonsProps) {
  return (
    <div className="flex justify-center space-x-6">
      <Button
        variant="outline"
        size="lg"
        className="rounded-full w-16 h-16 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
        onClick={onDislike}
        disabled={disabled}
      >
        <X className="h-8 w-8 text-gray-600 hover:text-red-500" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="rounded-full w-16 h-16 border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 disabled:opacity-50"
        onClick={onLike}
        disabled={disabled}
      >
        <Heart className="h-8 w-8 text-pink-500 hover:text-pink-600" fill="currentColor" />
      </Button>
    </div>
  )
}
