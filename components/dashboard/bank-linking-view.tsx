"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"
import type { BankLink } from "@/lib/types"

export function BankLinkingView() {
  const [bankLinks, setBankLinks] = useState<BankLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBankLinks = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/bank-links")
        const data = await res.json()
        setBankLinks(data)
      } catch (error) {
        console.error("Failed to fetch bank links:", error)
        setBankLinks([])
      } finally {
        setLoading(false)
      }
    }
    fetchBankLinks()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Linked Bank Accounts</h2>

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead className="text-center">Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Loading bank links...
                </TableCell>
              </TableRow>
            ) : bankLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No bank accounts linked.
                </TableCell>
              </TableRow>
            ) : (
              bankLinks.map((link) => (
                <TableRow key={link._id}>
                  <TableCell className="font-medium">{link.userName}</TableCell>
                  <TableCell>{link.bankName}</TableCell>
                  <TableCell>{link.accountNumber}</TableCell>
                  <TableCell className="text-center">
                    {link.isVerified ? (
                      <CheckCircle size={20} className="text-green-500 mx-auto" />
                    ) : (
                      <XCircle size={20} className="text-red-500 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
