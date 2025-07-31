"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { User as UserData } from "@/lib/types"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to save user data to MongoDB
  const saveUserToDatabase = async (firebaseUser: User) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          fullName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          profilePicture: firebaseUser.photoURL || "",
        }),
      })

      if (response.ok) {
        const savedUser = await response.json()
        setUserData(savedUser)
      } else {
        console.error("Failed to save user to database")
      }
    } catch (error) {
      console.error("Error saving user to database:", error)
    }
  }

  // Function to fetch user data from MongoDB
  const fetchUserData = async (firebaseUid: string) => {
    try {
      const response = await fetch(`/api/users?firebaseUid=${firebaseUid}`)
      if (response.ok) {
        const userData = await response.json()
        console.log("Fetched updated user data:", userData)
        setUserData(userData)
      } else {
        console.error("Failed to fetch user data:", response.status)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  // Function to refresh user data (useful when MPIN status changes)
  const refreshUserData = async () => {
    if (user?.uid) {
      console.log("Refreshing user data for:", user.uid)
      await fetchUserData(user.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Save or update user data in MongoDB
        await saveUserToDatabase(firebaseUser)
      } else {
        // Clear user data when logged out
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      console.error("Error signing in with Google:", error)

      if (error.code === "auth/unauthorized-domain") {
        setError(`Domain not authorized. Please add "${window.location.hostname}" to your Firebase authorized domains.`)
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.")
      } else if (error.code === "auth/popup-blocked") {
        setError("Pop-up was blocked by your browser. Please allow pop-ups and try again.")
      } else {
        setError(error.message || "Failed to sign in with Google")
      }
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error: any) {
      console.error("Error signing out:", error)
      setError(error.message || "Failed to sign out")
    }
  }

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle,
    logout,
    refreshUserData,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
