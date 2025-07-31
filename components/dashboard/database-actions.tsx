"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RefreshCw,
  Download,
  Database,
  TestTube,
  CheckCircle,
  XCircle,
  Users,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react"
import { useState } from "react"

export function DatabaseActions() {
  const [syncing, setSyncing] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [testing, setTesting] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)

  const handleTestConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()
      setDbStatus(result)

      if (result.connected) {
        alert(
          `Database connected successfully!\nDatabase: ${result.database}\nCollections: ${result.collections?.join(", ") || "None"}\nUsers: ${result.counts?.users || 0}\nTransactions: ${result.counts?.transactions || 0}\nBank Links: ${result.counts?.bankLinks || 0}`,
        )
      } else {
        alert(`Database connection failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Database test failed:", error)
      setDbStatus({ connected: false, error: error.message })
      alert("Database connection test failed!")
    } finally {
      setTesting(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      // Refresh all data by calling the test endpoint
      const response = await fetch("/api/test-db")
      const result = await response.json()

      if (result.connected) {
        // Trigger a page refresh to reload all dashboard data
        window.location.reload()
      } else {
        alert("Sync failed: Database not connected")
      }
    } catch (error) {
      console.error("Sync failed:", error)
      alert("Sync failed!")
    } finally {
      setSyncing(false)
    }
  }

  const handleTestQuery = async () => {
    setQuerying(true)
    try {
      // Test all API endpoints
      const [usersRes, transactionsRes, bankLinksRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/transactions"),
        fetch("/api/admin/bank-links"),
      ])

      const users = await usersRes.json()
      const transactions = await transactionsRes.json()
      const bankLinks = await bankLinksRes.json()

      console.log("API Test Results:", { users, transactions, bankLinks })

      const userCount = Array.isArray(users) ? users.length : 0
      const transactionCount = Array.isArray(transactions) ? transactions.length : 0
      const bankLinkCount = Array.isArray(bankLinks) ? bankLinks.length : 0

      alert(
        `API test completed successfully!\n\nResults:\n• Users: ${userCount}\n• Transactions: ${transactionCount}\n• Bank Links: ${bankLinkCount}`,
      )
    } catch (error) {
      console.error("API test failed:", error)
      alert("API test failed!")
    } finally {
      setQuerying(false)
    }
  }

  const handleExportData = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `database-status-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert("Database status exported successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed!")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Database Actions</h2>

      {dbStatus && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {dbStatus.connected ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Connection Status:</p>
                  <p className={dbStatus.connected ? "text-green-600" : "text-red-600"}>
                    {dbStatus.connected ? "Connected" : "Disconnected"}
                  </p>
                </div>
                {dbStatus.database && (
                  <div>
                    <p className="font-medium">Database:</p>
                    <p className="text-gray-600">{dbStatus.database}</p>
                  </div>
                )}
              </div>

              {dbStatus.collections && (
                <div>
                  <p className="font-medium text-sm">Collections:</p>
                  <p className="text-gray-600 text-sm">{dbStatus.collections.join(", ")}</p>
                </div>
              )}

              {dbStatus.counts && (
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <Users size={20} className="mx-auto text-blue-600 mb-1" />
                    <p className="text-lg font-bold">{dbStatus.counts.users}</p>
                    <p className="text-xs text-gray-500">Users</p>
                  </div>
                  <div className="text-center">
                    <ArrowLeftRight size={20} className="mx-auto text-green-600 mb-1" />
                    <p className="text-lg font-bold">{dbStatus.counts.transactions}</p>
                    <p className="text-xs text-gray-500">Transactions</p>
                  </div>
                  <div className="text-center">
                    <CreditCard size={20} className="mx-auto text-purple-600 mb-1" />
                    <p className="text-lg font-bold">{dbStatus.counts.bankLinks}</p>
                    <p className="text-xs text-gray-500">Bank Links</p>
                  </div>
                </div>
              )}

              {dbStatus.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-600 text-sm">
                    <strong>Error:</strong> {dbStatus.error}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} /> MongoDB Connection
          </CardTitle>
          <CardDescription>Test and manage your MongoDB database connection.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {testing ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Database size={16} className="mr-2" />}
            {testing ? "Testing Connection..." : "Test DB Connection"}
          </Button>
          <Button onClick={handleSync} disabled={syncing} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {syncing ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
            {syncing ? "Syncing..." : "Refresh Dashboard"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube size={20} /> API & Data Tools
          </CardTitle>
          <CardDescription>Tools for testing APIs and exporting database information.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handleTestQuery} disabled={querying} variant="secondary" className="w-full">
            {querying ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <TestTube size={16} className="mr-2" />}
            {querying ? "Testing APIs..." : "Test All APIs"}
          </Button>
          <Button onClick={handleExportData} disabled={exporting} variant="secondary" className="w-full">
            {exporting ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            {exporting ? "Exporting..." : "Export DB Status"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
