"use client"

import { useState } from "react"
import { processImageWithOCR, mapToSalesforceFields, type OCRResult } from "@/lib/ocr-service"

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = async (file: File) => {
    if (!file) return null

    try {
      setIsProcessing(true)
      setError(null)

      const ocrResult = await processImageWithOCR(file)
      setResult(ocrResult)

      return ocrResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process image"
      setError(errorMessage)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const mapToSalesforce = (attributes: Record<string, string>) => {
    return mapToSalesforceFields(attributes)
  }

  return {
    processImage,
    mapToSalesforce,
    isProcessing,
    result,
    error,
    reset: () => {
      setResult(null)
      setError(null)
    },
  }
}
