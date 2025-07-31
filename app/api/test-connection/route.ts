import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    const { db } = await connectToDatabase()
    console.log("Database connection successful!")
    
    // Test basic operations
    const usersCollection = db.collection("users")
    const userCount = await usersCollection.countDocuments()
    
    console.log("Database test successful. User count:", userCount)
    
    return NextResponse.json({
      success: true,
      message: "Database connection and operations successful",
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, fullName, email } = await request.json()
    
    console.log("Testing user creation:", { firebaseUid, fullName, email })
    
    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ firebaseUid })
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
        user: {
          firebaseUid: existingUser.firebaseUid,
          fullName: existingUser.fullName,
          email: existingUser.email,
          mpinStatus: existingUser.mpinStatus
        }
      })
    }
    
    // Create test user
    const testUser = {
      firebaseUid,
      fullName: fullName || "Test User",
      email: email || "test@example.com",
      profilePicture: "",
      walletBalance: 0,
      mpinStatus: "Not Set",
      linkedBanks: [],
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const result = await usersCollection.insertOne(testUser)
    
    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      insertedId: result.insertedId,
      user: testUser
    })
    
  } catch (error) {
    console.error("User creation test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 