"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  History,
  Settings,
  Shield,
  Fingerprint,
  LogOut,
  Plus,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { MPINSetupScreen } from "./mpin-setup-screen"
import { MPINChangeScreen } from "./mpin-change-screen"
import { MPINVerifyScreen } from "./mpin-verify-screen"

interface ProfileScreenProps {
  onBack: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, userData, logout } = useAuth()
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)

  const [showMPINSetup, setShowMPINSetup] = useState(false)
  const [showMPINChange, setShowMPINChange] = useState(false)
  const [showMPINVerify, setShowMPINVerify] = useState(false)

  if (!user) return null

  if (showMPINSetup) {
    return (
      <MPINSetupScreen
        onBack={() => setShowMPINSetup(false)}
        onComplete={() => {
          setShowMPINSetup(false)
        }}
      />
    )
  }

  if (showMPINChange) {
    return <MPINChangeScreen onBack={() => setShowMPINChange(false)} onComplete={() => setShowMPINChange(false)} />
  }

  if (showMPINVerify) {
    return <MPINVerifyScreen onBack={() => setShowMPINVerify(false)} onSuccess={() => setShowMPINVerify(false)} />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const indianBanks = [
    { name: "State Bank of India", code: "SBI", logo: "🏦" },
    { name: "HDFC Bank", code: "HDFC", logo: "🏛️" },
    { name: "ICICI Bank", code: "ICICI", logo: "🏪" },
    { name: "Axis Bank", code: "AXIS", logo: "🏢" },
    { name: "Kotak Mahindra Bank", code: "KOTAK", logo: "🏦" },
    { name: "Punjab National Bank", code: "PNB", logo: "🏛️" },
    { name: "Bank of Baroda", code: "BOB", logo: "🏪" },
    { name: "Canara Bank", code: "CANARA", logo: "🏢" },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "sent",
      amount: 250.0,
      contact: "Priya Sharma",
      date: "Today, 2:30 PM",
      status: "completed",
    },
    {
      id: 2,
      type: "received",
      amount: 1200.0,
      contact: "Rajesh Kumar",
      date: "Yesterday, 6:45 PM",
      status: "completed",
    },
    {
      id: 3,
      type: "sent",
      amount: 89.5,
      contact: "Swiggy",
      date: "Yesterday, 1:20 PM",
      status: "completed",
    },
    {
      id: 4,
      type: "received",
      amount: 500.0,
      contact: "Mom",
      date: "2 days ago",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Profile & Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-gray-200">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg font-semibold">
                  {getInitials(user.displayName || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{user.displayName || "User"}</h2>
                <p className="text-gray-600 truncate text-sm">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Section */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet size={20} />
                <span className="text-green-100 text-sm font-medium">Wallet Balance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-green-200" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  userData?.mpinStatus === "Set" 
                    ? "bg-green-200 text-green-800" 
                    : "bg-yellow-200 text-yellow-800"
                }`}>
                  {userData?.mpinStatus === "Set" ? "MPIN Set" : "MPIN Not Set"}
                </span>
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-4xl font-bold">₹{userData?.walletBalance?.toFixed(2) || "0.00"}</p>
              <Button
                onClick={() => (userData?.mpinStatus === "Set" ? setShowMPINChange(true) : setShowMPINSetup(true))}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                {userData?.mpinStatus === "Set" ? "Change MPIN" : "Set MPIN"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bank Linking Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <CreditCard size={20} className="mr-2" />
              Linked Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing linked account (example) */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🏦</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">HDFC Bank</p>
                  <p className="text-sm text-gray-600">****1234</p>
                </div>
              </div>
              <div className="text-green-600 text-sm font-medium">✓ Verified</div>
            </div>

            <Button
              onClick={() => setShowBankModal(true)}
              variant="outline"
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus size={16} className="mr-2" />
              Link a Bank Account
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <History size={20} className="mr-2" />
                Recent Transactions
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "sent" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}
                  >
                    {transaction.type === "sent" ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.contact}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === "sent" ? "text-red-600" : "text-green-600"}`}>
                    {transaction.type === "sent" ? "-" : "+"}₹{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <Settings size={20} className="mr-2" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Fingerprint size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Biometric Authentication</p>
                  <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                </div>
              </div>
              <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Test MPIN</p>
                  <p className="text-sm text-gray-600">Verify your MPIN</p>
                </div>
              </div>
              <Button onClick={() => setShowMPINVerify(true)} size="sm" variant="outline">
                Test
              </Button>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bank Selection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Select Your Bank</h3>
                <Button onClick={() => setShowBankModal(false)} variant="ghost" size="sm">
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {indianBanks.map((bank) => (
                <Button
                  key={bank.code}
                  onClick={() => {
                    setShowBankModal(false)
                    // Handle bank selection
                  }}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{bank.logo}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{bank.name}</p>
                      <p className="text-sm text-gray-600">{bank.code}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}