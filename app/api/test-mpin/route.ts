import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firebaseUid = searchParams.get("firebaseUid")

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "firebaseUid is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ firebaseUid })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        firebaseUid: user.firebaseUid,
        fullName: user.fullName,
        email: user.email,
        mpinStatus: user.mpinStatus,
        hasMpin: !!user.mpin,
        walletBalance: user.walletBalance,
        linkedBanks: user.linkedBanks,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error("Error testing MPIN:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 