"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, CheckCircle } from "lucide-react"
import { NumericKeypad } from "./numeric-keypad"
import { MPINDots } from "./mpin-dots"
import { useAuth } from "@/contexts/auth-context"

interface MPINChangeScreenProps {
  onBack: () => void
  onComplete: () => void
}

export function MPINChangeScreen({ onBack, onComplete }: MPINChangeScreenProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<"current" | "new" | "confirm" | "success">("current")
  const [currentMpin, setCurrentMpin] = useState("")
  const [newMpin, setNewMpin] = useState("")
  const [confirmMpin, setConfirmMpin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const MPIN_LENGTH = 4

  const handleNumberPress = (number: string) => {
    setError("")

    if (step === "current") {
      if (currentMpin.length < MPIN_LENGTH) {
        setCurrentMpin((prev) => prev + number)
      }
    } else if (step === "new") {
      if (newMpin.length < MPIN_LENGTH) {
        setNewMpin((prev) => prev + number)
      }
    } else if (step === "confirm") {
      if (confirmMpin.length < MPIN_LENGTH) {
        setConfirmMpin((prev) => prev + number)
      }
    }
  }

  const handleBackspace = () => {
    setError("")

    if (step === "current") {
      setCurrentMpin((prev) => prev.slice(0, -1))
    } else if (step === "new") {
      setNewMpin((prev) => prev.slice(0, -1))
    } else if (step === "confirm") {
      setConfirmMpin((prev) => prev.slice(0, -1))
    }
  }

  const handleCurrentMPINComplete = async () => {
    if (currentMpin.length === MPIN_LENGTH) {
      setIsLoading(true)
      
      try {
        // Verify current MPIN
        const response = await fetch("/api/mpin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: user?.uid,
            mpin: currentMpin,
            action: "verify"
          }),
        })

        if (response.ok) {
          setStep("new")
        } else {
          setError("Incorrect current MPIN. Please try again.")
          setCurrentMpin("")
        }
      } catch (error) {
        console.error("Error verifying current MPIN:", error)
        setError("Network error. Please check your connection and try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleNewMPINComplete = () => {
    if (newMpin.length === MPIN_LENGTH) {
      if (newMpin === currentMpin) {
        setError("New MPIN cannot be the same as current MPIN.")
        setNewMpin("")
      } else {
        setStep("confirm")
      }
    }
  }

  const handleConfirmMPINComplete = async () => {
    if (confirmMpin.length === MPIN_LENGTH) {
      if (newMpin === confirmMpin) {
        setIsLoading(true)
        
        try {
          // Update MPIN
          const response = await fetch("/api/mpin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUid: user?.uid,
              mpin: newMpin,
              action: "change"
            }),
          })

          if (response.ok) {
            setStep("success")
          } else {
            const errorData = await response.json()
            setError(errorData.error || "Failed to update MPIN. Please try again.")
          }
        } catch (error) {
          console.error("Error updating MPIN:", error)
          setError("Network error. Please check your connection and try again.")
        } finally {
          setIsLoading(false)
        }
      } else {
        setError("MPIN doesn't match. Please try again.")
        setConfirmMpin("")
      }
    }
  }

  // Auto-proceed logic
  if (step === "current" && currentMpin.length === MPIN_LENGTH && !error && !isLoading) {
    setTimeout(handleCurrentMPINComplete, 300)
  }

  if (step === "new" && newMpin.length === MPIN_LENGTH && !error) {
    setTimeout(handleNewMPINComplete, 300)
  }

  if (step === "confirm" && confirmMpin.length === MPIN_LENGTH && !error) {
    setTimeout(handleConfirmMPINComplete, 300)
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
              <h2 className="text-2xl font-bold text-gray-900">MPIN Changed Successfully!</h2>
              <p className="text-gray-600">Your MPIN has been updated securely.</p>
            </div>
            <Button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStepInfo = () => {
    switch (step) {
      case "current":
        return {
          title: "Enter Current MPIN",
          subtitle: "Enter your current 4-digit MPIN",
          filledCount: currentMpin.length,
        }
      case "new":
        return {
          title: "Enter New MPIN",
          subtitle: "Create a new 4-digit MPIN",
          filledCount: newMpin.length,
        }
      case "confirm":
        return {
          title: "Confirm New MPIN",
          subtitle: "Re-enter your new 4-digit MPIN",
          filledCount: confirmMpin.length,
        }
      default:
        return { title: "", subtitle: "", filledCount: 0 }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Change MPIN</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">{stepInfo.title}</CardTitle>
            <p className="text-gray-600 text-sm">{stepInfo.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MPINDots length={MPIN_LENGTH} filledCount={stepInfo.filledCount} error={!!error} />

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
                  <span className="text-sm">
                    {step === "current" ? "Verifying current MPIN..." : "Updating MPIN..."}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
