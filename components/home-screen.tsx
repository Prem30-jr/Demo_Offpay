"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Wallet, CreditCard, Send, ReceiptIcon as Receive } from "lucide-react"
import { ProfileScreen } from "./profile-screen"
import { useState } from "react"

export function HomeScreen() {
  const { user, userData, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  if (!user) return null

  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">WalletPay</h1>
          </div>
          <Button
            onClick={() => setShowProfile(true)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                {getInitials(user.displayName || "User")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* User Profile Card */}
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

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold">₹{userData?.walletBalance?.toFixed(2) || "0.00"}</p>
              <p className="text-blue-100 text-xs">Last updated: Just now</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Send size={20} className="text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Send</p>
              <p className="text-xs text-gray-600">Money</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Receive size={20} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Receive</p>
              <p className="text-xs text-gray-600">Payment</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard size={20} className="text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Cards</p>
              <p className="text-xs text-gray-600">Manage</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Send size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment sent</p>
                <p className="text-xs text-gray-600">To John Doe • 2 hours ago</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">-₹125.00</p>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Receive size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-600">From Sarah Smith • 1 day ago</p>
              </div>
              <p className="text-sm font-semibold text-green-600">+₹89.50</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
