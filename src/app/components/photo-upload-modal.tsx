"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/app/components/ui/modal"

interface PhotoUploadModalProps {
  onSave: (file: File) => void
  triggerButton?: React.ReactNode
}

export function PhotoUploadModal({ onSave, triggerButton }: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile)
      setOpen(false)
      // Reset after save
      setSelectedFile(null)
      setPreview(null)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    setOpen(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" /> Upload Photo
          </Button>
        )}
      </ModalTrigger>
      <ModalContent className="sm:max-w-md bg-white">
        <ModalHeader>
          <ModalTitle>Upload Photo</ModalTitle>
          <ModalDescription>
            Upload a new photo to your profile. The image will be visible to other users.
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col items-center justify-center p-4">
          {preview ? (
            <div className="relative w-full max-w-sm aspect-square mb-4">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded-md" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-muted-foreground/20 rounded-md w-full max-w-sm aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/40 transition-colors mb-4"
              onClick={triggerFileInput}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max. 5MB)</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {!preview && (
            <Button variant="secondary" onClick={triggerFileInput} className="mt-2">
              Select File
            </Button>
          )}
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedFile}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
