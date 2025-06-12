"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isConnected: boolean
}

export default function MessageInput({ onSendMessage, isConnected }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState<string>("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !isConnected) return

    onSendMessage(newMessage.trim())
    setNewMessage("")
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="pr-10 py-6 rounded-full"
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isConnected}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          size="icon"
          className="h-10 w-10 rounded-full shrink-0 bg-pink-500 hover:bg-pink-600"
          disabled={!isConnected || !newMessage.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
