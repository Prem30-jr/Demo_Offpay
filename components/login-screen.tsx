"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Wallet, AlertCircle } from "lucide-react"
import { DomainAuthorization } from "./domain-authorization"

export function LoginScreen() {
  const { signInWithGoogle, loading, error } = useAuth()
  const [showDomainAuth, setShowDomainAuth] = useState(false)

  // Show domain authorization screen if unauthorized domain error
  if (showDomainAuth || (error && error.includes("authorized domains"))) {
    return <DomainAuthorization />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background wallet illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10">
          <Wallet size={120} className="text-blue-600" />
        </div>
        <div className="absolute bottom-32 right-8 opacity-10">
          <Wallet size={80} className="text-purple-600" />
        </div>
        <div className="absolute top-1/2 right-20 opacity-10">
          <Wallet size={60} className="text-indigo-600" />
        </div>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8 text-center space-y-8">
          {/* App branding */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet size={32} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">WalletPay</h1>
              <p className="text-gray-600 text-lg font-medium">Offline Payments. Online Assurance.</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Fix Domain Authorization Button */}
          {error && error.includes("authorized") && (
            <Button onClick={() => setShowDomainAuth(true)} variant="outline" size="sm" className="text-blue-600">
              Fix Domain Authorization
            </Button>
          )}

          {/* Google Sign In Button */}
          <div className="space-y-6">
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
              variant="outline"
            >
              <div className="flex items-center justify-center space-x-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-base font-medium">{loading ? "Signing in..." : "Continue with Google"}</span>
              </div>
            </Button>

            <p className="text-sm text-gray-500 px-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
