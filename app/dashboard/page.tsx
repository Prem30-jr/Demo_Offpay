"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserManagement } from "@/components/dashboard/user-management"
import { TransactionsOverview } from "@/components/dashboard/transactions-overview"
import { BankLinkingView } from "@/components/dashboard/bank-linking-view"
import { DatabaseActions } from "@/components/dashboard/database-actions"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("users") // Default active tab

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />
      case "transactions":
        return <TransactionsOverview />
      case "bank-linking":
        return <BankLinkingView />
      case "database-actions":
        return <DatabaseActions />
      default:
        return <UserManagement />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}
