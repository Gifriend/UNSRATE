"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Camera, Upload, X, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal"

interface PhotoUploadModalProps {
  onSave: (file: File) => void
  triggerButton?: React.ReactNode
  isUploading?: boolean
}

export function PhotoUploadModal({ onSave, triggerButton, isUploading = false }: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      return "Please select a valid image file (PNG, JPG, JPEG, or WEBP)"
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB"
    }

    return null
  }

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Only set to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    setOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal open={open} onOpenChange={(open) => open ? setOpen(true) : handleClose()}>
      <ModalTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" /> Upload Photo
          </Button>
        )}
      </ModalTrigger>
      <ModalContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            Upload Profile Photo
          </ModalTitle>
          <ModalDescription>
            Choose a photo that represents you well. This will be visible to other users on your profile.
          </ModalDescription>
        </ModalHeader>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {preview ? (
            <div className="space-y-4">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                      onClick={removeSelectedFile}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Photo Ready!</span>
                </div>
                <p className="text-xs text-green-600 mb-1">{selectedFile?.name}</p>
                <p className="text-xs text-green-600">{selectedFile && formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-2xl w-full aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-pink-400 bg-pink-50 scale-105 shadow-lg'
                    : 'border-gray-300 hover:border-pink-300 hover:bg-pink-25'
                }`}
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center space-y-4 p-8">
                  <div className={`transition-all duration-300 ${isDragOver ? 'scale-125' : ''}`}>
                    <div className="relative">
                      <Upload className={`h-10 w-10 mx-auto ${isDragOver ? 'text-pink-500' : 'text-gray-400'}`} />
                      {isDragOver && (
                        <div className="absolute inset-0 bg-pink-500 rounded-full opacity-20 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className={`text-lg font-semibold ${isDragOver ? 'text-pink-600' : 'text-gray-700'}`}>
                      {isDragOver ? 'Drop your photo here!' : 'Upload your photo'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag and drop your image here
                    </p>
                    <p className="text-xs text-gray-400">
                      or click to browse your files
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      PNG, JPG, JPEG or WEBP (max. 5MB)
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={triggerFileInput} 
                  className="w-full max-w-xs border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Choose from device
                </Button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
          />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedFile || isUploading}
            className="min-w-[120px] bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Photo
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}