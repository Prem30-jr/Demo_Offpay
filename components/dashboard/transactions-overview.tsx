"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, ArrowDownUp } from "lucide-react"
import type { Transaction } from "@/lib/types"

export function TransactionsOverview() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("all") // Updated default value
  const [sortBy, setSortBy] = useState<string>("timestamp") // 'timestamp' or 'amount'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // 'asc' or 'desc'

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/transactions?type=${filterType}`)
        const data: Transaction[] = await res.json()

        // Client-side sorting for placeholder data
        data.sort((a, b) => {
          let valA: any, valB: any
          if (sortBy === "timestamp") {
            valA = new Date(a.timestamp).getTime()
            valB = new Date(b.timestamp).getTime()
          } else {
            // sortBy === 'amount'
            valA = a.amount
            valB = b.amount
          }

          if (sortOrder === "asc") {
            return valA - valB
          } else {
            return valB - valA
          }
        })

        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [filterType, sortBy, sortOrder])

  const toggleSortOrder = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc") // Default to desc when changing column
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Transactions Overview</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Filter by user email (not implemented for placeholder)"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300"
            disabled
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem> {/* Updated value prop */}
            <SelectItem value="sent">Sent</SelectItem> {/* Updated value prop */}
            <SelectItem value="received">Received</SelectItem> {/* Updated value prop */}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Sender ID</TableHead>
              <TableHead>Receiver ID</TableHead>
              <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => toggleSortOrder("amount")}>
                <div className="flex items-center">
                  Amount <ArrowDownUp size={14} className="ml-1" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => toggleSortOrder("timestamp")}>
                <div className="flex items-center">
                  Timestamp <ArrowDownUp size={14} className="ml-1" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>{tx.senderId}</TableCell>
                  <TableCell>{tx.receiverId}</TableCell>
                  <TableCell>₹{tx.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
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
