"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, AlertCircle } from "lucide-react"
import { NumericKeypad } from "./numeric-keypad"
import { MPINDots } from "./mpin-dots"
import { useAuth } from "@/contexts/auth-context"

interface MPINVerifyScreenProps {
  onBack: () => void
  onSuccess: () => void
  title?: string
  subtitle?: string
}

export function MPINVerifyScreen({
  onBack,
  onSuccess,
  title = "Enter MPIN",
  subtitle = "Enter your 4-digit MPIN to continue",
}: MPINVerifyScreenProps) {
  const { user } = useAuth()
  const [mpin, setMpin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const MPIN_LENGTH = 4
  const MAX_ATTEMPTS = 3

  const handleNumberPress = (number: string) => {
    setError("")

    if (mpin.length < MPIN_LENGTH) {
      setMpin((prev) => prev + number)
    }
  }

  const handleBackspace = () => {
    setError("")
    setMpin((prev) => prev.slice(0, -1))
  }

  const handleVerifyMPIN = async () => {
    if (mpin.length === MPIN_LENGTH) {
      setIsLoading(true)

      try {
        // Call the real API to verify MPIN
        const response = await fetch("/api/mpin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: user?.uid,
            mpin: mpin,
            action: "verify"
          }),
        })

        if (response.ok) {
          onSuccess()
        } else {
          const errorData = await response.json()
          const newAttempts = attempts + 1
          setAttempts(newAttempts)

          if (newAttempts >= MAX_ATTEMPTS) {
            setError("Too many incorrect attempts. Please try again later.")
          } else {
            setError(`Incorrect MPIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`)
          }

          setMpin("")
        }
      } catch (error) {
        console.error("Error verifying MPIN:", error)
        setError("Network error. Please check your connection and try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Auto-verify when MPIN is complete
  if (mpin.length === MPIN_LENGTH && !error && !isLoading) {
    setTimeout(handleVerifyMPIN, 300)
  }

  const isBlocked = attempts >= MAX_ATTEMPTS

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                error ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {error ? (
                <AlertCircle size={32} className="text-red-600" />
              ) : (
                <Shield size={32} className="text-blue-600" />
              )}
            </div>
            <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MPINDots length={MPIN_LENGTH} filledCount={mpin.length} error={!!error} />

            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {isBlocked ? (
              <div className="text-center space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">Account temporarily locked due to multiple incorrect attempts.</p>
                </div>
                <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
                  Go Back
                </Button>
              </div>
            ) : (
              <>
                <NumericKeypad
                  onNumberPress={handleNumberPress}
                  onBackspace={handleBackspace}
                  disabled={isLoading || isBlocked}
                />

                {isLoading && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Verifying MPIN...</span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Forgot MPIN?
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
