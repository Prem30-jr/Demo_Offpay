"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, CheckCircle } from "lucide-react"
import { NumericKeypad } from "./numeric-keypad"
import { MPINDots } from "./mpin-dots"
import { useAuth } from "@/contexts/auth-context"

interface MPINSetupScreenProps {
  onBack: () => void
  onComplete: () => void
}

export function MPINSetupScreen({ onBack, onComplete }: MPINSetupScreenProps) {
  const { user, refreshUserData } = useAuth()
  const [step, setStep] = useState<"setup" | "confirm" | "success">("setup")
  const [mpin, setMpin] = useState("")
  const [confirmMpin, setConfirmMpin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const MPIN_LENGTH = 4

  const handleNumberPress = (number: string) => {
    setError("")

    if (step === "setup") {
      if (mpin.length < MPIN_LENGTH) {
        setMpin((prev) => prev + number)
      }
    } else if (step === "confirm") {
      if (confirmMpin.length < MPIN_LENGTH) {
        setConfirmMpin((prev) => prev + number)
      }
    }
  }

  const handleBackspace = () => {
    setError("")

    if (step === "setup") {
      setMpin((prev) => prev.slice(0, -1))
    } else if (step === "confirm") {
      setConfirmMpin((prev) => prev.slice(0, -1))
    }
  }

  const handleSetupComplete = () => {
    if (mpin.length === MPIN_LENGTH) {
      setStep("confirm")
    }
  }

  const handleConfirmComplete = async () => {
    if (confirmMpin.length === MPIN_LENGTH) {
      console.log("Confirming MPIN:", { mpin, confirmMpin, match: mpin === confirmMpin })
      
      if (mpin === confirmMpin) {
        setIsLoading(true)
        
        try {
          console.log("Sending MPIN setup request:", { firebaseUid: user?.uid, mpin, action: "setup" })
          
          // First, ensure user exists in database
          if (user?.uid) {
            console.log("Ensuring user exists in database before MPIN setup...")
            await refreshUserData()
          }
          
          // Call the real API to save MPIN
          const response = await fetch("/api/mpin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUid: user?.uid,
              mpin: mpin,
              action: "setup"
            }),
          })

          console.log("MPIN setup response status:", response.status)
          
          if (response.ok) {
            const responseData = await response.json()
            console.log("MPIN setup response:", responseData)
            
            // Wait a moment for database to update, then refresh user data
            setTimeout(async () => {
              console.log("Refreshing user data after MPIN setup...")
              await refreshUserData()
              setStep("success")
            }, 500)
          } else {
            const errorData = await response.json()
            console.error("MPIN setup error:", errorData)
            
            // Handle specific error cases
            if (response.status === 404 && errorData.error?.includes("User not found")) {
              setError("User not found. Please try signing in again.")
            } else {
              setError(errorData.error || "Failed to set MPIN. Please try again.")
            }
          }
        } catch (error) {
          console.error("Error setting MPIN:", error)
          setError("Network error. Please check your connection and try again.")
        } finally {
          setIsLoading(false)
        }
      } else {
        console.log("MPIN mismatch:", { mpin, confirmMpin })
        setError("MPIN doesn't match. Please try again.")
        setConfirmMpin("")
      }
    }
  }

  const handleSuccessComplete = () => {
    onComplete()
  }

  // Auto-proceed when MPIN is complete
  if (step === "setup" && mpin.length === MPIN_LENGTH && !error && !isLoading) {
    setTimeout(handleSetupComplete, 300)
  }

  if (step === "confirm" && confirmMpin.length === MPIN_LENGTH && !error && !isLoading) {
    setTimeout(handleConfirmComplete, 300)
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">MPIN Set Successfully!</h2>
              <p className="text-gray-600">Your 4-digit MPIN has been created securely.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <span className="font-medium">Remember:</span> Keep your MPIN confidential and don't share it with
                anyone.
              </p>
            </div>
            <Button onClick={handleSuccessComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{step === "setup" ? "Set MPIN" : "Confirm MPIN"}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              {step === "setup" ? "Create Your MPIN" : "Confirm Your MPIN"}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {step === "setup" ? "Enter a 4-digit PIN to secure your wallet" : "Re-enter your 4-digit PIN to confirm"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MPINDots
              length={MPIN_LENGTH}
              filledCount={step === "setup" ? mpin.length : confirmMpin.length}
              error={!!error}
            />

            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <NumericKeypad onNumberPress={handleNumberPress} onBackspace={handleBackspace} disabled={isLoading} />

            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Setting up your MPIN...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
