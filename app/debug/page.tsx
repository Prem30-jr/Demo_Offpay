"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [dbTestResult, setDbTestResult] = useState<any>(null)
  const [userTestResult, setUserTestResult] = useState<any>(null)
  const [connectionTestResult, setConnectionTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)

  // Load auth context safely
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Try to get user from localStorage or session
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.log("No user data found")
      }
      setAuthLoaded(true)
    }
    
    loadAuth()
  }, [])

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()
      setDbTestResult(result)
    } catch (error) {
      setDbTestResult({ error: "Failed to test database connection" })
    } finally {
      setLoading(false)
    }
  }

  const testConnectionAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setConnectionTestResult(result)
    } catch (error) {
      setConnectionTestResult({ error: "Failed to test connection API" })
    } finally {
      setLoading(false)
    }
  }

  const testUserCreation = async () => {
    if (!user?.uid) {
      setUserTestResult({ error: "No user logged in" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          fullName: user.displayName || "Test User",
          email: user.email || "test@example.com",
        }),
      })
      const result = await response.json()
      setUserTestResult(result)
    } catch (error) {
      setUserTestResult({ error: "Failed to test user creation" })
    } finally {
      setLoading(false)
    }
  }

  const testUserAPI = async () => {
    if (!user?.uid) {
      setUserTestResult({ error: "No user logged in" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          fullName: user.displayName || "Test User",
          email: user.email || "test@example.com",
          profilePicture: user.photoURL || "",
        }),
      })
      const result = await response.json()
      setUserTestResult({ status: response.status, data: result })
    } catch (error) {
      setUserTestResult({ error: "Failed to test user API" })
    } finally {
      setLoading(false)
    }
  }

  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debug tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Debug Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testDatabaseConnection} disabled={loading}>
                Test Database Connection
              </Button>
              <Button onClick={testConnectionAPI} disabled={loading}>
                Test Connection API
              </Button>
              <Button onClick={testUserCreation} disabled={loading || !user}>
                Test User Creation (Connection API)
              </Button>
              <Button onClick={testUserAPI} disabled={loading || !user}>
                Test User API
              </Button>
            </div>

            {dbTestResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Database Test Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(dbTestResult, null, 2)}
                </pre>
              </div>
            )}

            {connectionTestResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Connection Test Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(connectionTestResult, null, 2)}
                </pre>
              </div>
            )}

            {userTestResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">User Test Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(userTestResult, null, 2)}
                </pre>
              </div>
            )}

            {user && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Current User Info:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                  }, null, 2)}
                </pre>
              </div>
            )}

            {!user && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> You need to be signed in to test user-related APIs. 
                  Please sign in first and then return to this page.
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. First test the database connection to see if MongoDB is accessible</li>
                <li>2. If connection fails, check your Vercel environment variables</li>
                <li>3. Test user creation to see if the issue is with user creation specifically</li>
                <li>4. Check the Vercel function logs for detailed error messages</li>
                <li>5. Ensure your MongoDB cluster allows connections from Vercel's IP ranges</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 