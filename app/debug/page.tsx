"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function DebugPage() {
  const { user } = useAuth()
  const [dbTestResult, setDbTestResult] = useState<any>(null)
  const [userTestResult, setUserTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

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

  const testUserCreation = async () => {
    if (!user?.uid) {
      setUserTestResult({ error: "No user logged in" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/test-db", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Debug Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDatabaseConnection} disabled={loading}>
                Test Database Connection
              </Button>
              <Button onClick={testUserCreation} disabled={loading || !user}>
                Test User Creation
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 