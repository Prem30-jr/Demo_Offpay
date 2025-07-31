export interface User {
  _id?: string
  firebaseUid: string
  fullName: string
  email: string
  profilePicture?: string
  walletBalance: number
  mpinStatus: "Set" | "Not Set"
  mpin?: string // Store the actual MPIN (in production, this should be hashed)
  linkedBanks: string[]
  isProfileComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  _id: string
  senderId: string
  receiverId: string
  amount: number
  timestamp: string
  status: "Success" | "Failed"
  type: "Sent" | "Received"
}

export interface BankLink {
  _id: string
  userId: string
  userName: string
  bankName: string
  accountNumber: string
  isVerified: boolean
}
