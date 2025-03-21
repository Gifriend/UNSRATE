"use client"

import { Button } from "@/app/components/ui/button"
import { Heart, Star, X } from "lucide-react"

interface ActionButtonsProps {
  onDislike: () => void
  onLike: () => void
  onSuperLike?: () => void
}

export default function ActionButtons({ onDislike, onLike, onSuperLike }: ActionButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        onClick={onDislike}
        size="icon"
        variant="outline"
        className="h-14 w-14 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-rose-500 transition-all duration-200"
      >
        <X className="h-7 w-7" />
        <span className="sr-only">Dislike</span>
      </Button>

      {onSuperLike && (
        <Button
          onClick={onSuperLike}
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-blue-500 transition-all duration-200"
        >
          <Star className="h-6 w-6" />
          <span className="sr-only">Super Like</span>
        </Button>
      )}

      <Button
        onClick={onLike}
        size="icon"
        variant="outline"
        className="h-14 w-14 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-pink-500 transition-all duration-200"
      >
        <Heart className="h-7 w-7" />
        <span className="sr-only">Like</span>
      </Button>
    </div>
  )
}

