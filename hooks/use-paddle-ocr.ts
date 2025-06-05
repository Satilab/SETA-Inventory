"use client"

import { useState } from "react"
import type { ExtractedAttributes } from "@/lib/ocr-service"

interface OCRResult {
  success: boolean
  rawText: string
  attributes: ExtractedAttributes
  error?: string
}

export function usePaddleOCR() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = async (file: File): Promise<OCRResult | null> => {
    if (!file) return null

    try {
      setIsProcessing(true)
      setError(null)

      // In a real implementation, this would call the backend API
      // For now, we'll use our mock service
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`OCR processing failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process image"
      setError(errorMessage)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processImage,
    isProcessing,
    result,
    error,
    reset: () => {
      setResult(null)
      setError(null)
    },
  }
}
