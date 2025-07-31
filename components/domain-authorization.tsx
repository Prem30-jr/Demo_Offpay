"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export function DomainAuthorization() {
  const [currentDomain, setCurrentDomain] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCurrentDomain(window.location.hostname)
  }, [])

  const copyDomain = () => {
    navigator.clipboard.writeText(currentDomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openFirebaseConsole = () => {
    window.open("https://console.firebase.google.com/project/offlinepayapp/authentication/settings", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900 flex items-center justify-center gap-2">
            <AlertTriangle className="text-amber-500" size={24} />
            Domain Authorization Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              The current domain <code className="bg-amber-100 px-1 rounded font-mono">{currentDomain}</code> is not
              authorized for Firebase Authentication.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Fix Steps:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Copy the current domain</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{currentDomain}</code>
                      <Button onClick={copyDomain} size="sm" variant="outline">
                        {copied ? "Copied!" : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Open Firebase Console</p>
                    <Button onClick={openFirebaseConsole} size="sm" variant="outline" className="mt-1 bg-transparent">
                      <ExternalLink size={14} className="mr-1" />
                      Open Authentication Settings
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Add the domain to authorized domains</p>
                    <ul className="text-sm text-gray-600 mt-1 ml-4 space-y-1">
                      <li>• Scroll down to "Authorized domains"</li>
                      <li>• Click "Add domain"</li>
                      <li>
                        • Paste: <code className="bg-gray-100 px-1 rounded">{currentDomain}</code>
                      </li>
                      <li>• Click "Add"</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Refresh this page and try signing in again</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Common domains to add:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <code>localhost</code> (for local development)
                </li>
                <li>
                  • <code>{currentDomain}</code> (current preview domain)
                </li>
                <li>• Your production domain (when you deploy)</li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
                Refresh Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
