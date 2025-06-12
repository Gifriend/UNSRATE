"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"
import { reportApi } from "@/app/services/api"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userId: string
}

export default function ReportDialog({ isOpen, onClose, userName, userId }: ReportDialogProps) {
  const [reportReason, setReportReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!reportReason.trim()) return

    try {
      setIsSubmitting(true)

      // Use the existing reportApi from your services
      await reportApi.createReport(userId, reportReason.trim())

      toast({
        title: "Laporan berhasil dikirim",
        description: "Tim kami akan meninjau laporan ini.",
        variant: "default",
      })

      setReportReason("")
      onClose()
    } catch (error) {
      console.error("Failed to submit report:", error)
      toast({
        title: "Gagal mengirim laporan",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReportReason("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Laporkan {userName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="reportReason" className="text-sm font-medium">
            Alasan Pelaporan
          </label>
          <Textarea
            id="reportReason"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Jelaskan mengapa Anda melaporkan pengguna ini..."
            className="mt-2 min-h-[100px]"
            disabled={isSubmitting}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">{reportReason.length}/500 karakter</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!reportReason.trim() || isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  
}