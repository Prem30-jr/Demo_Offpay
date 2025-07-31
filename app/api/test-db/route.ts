import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Test database connection
    const collections = await db.listCollections().toArray()
    const userCount = await db.collection("users").countDocuments()
    
    return NextResponse.json({
      status: "Database connected successfully",
      collections: collections.map(col => col.name),
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      { error: "Database connection failed", details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, fullName, email, profilePicture } = await request.json()
    
    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")
    
    // Test user creation
    const testUser = {
      firebaseUid: firebaseUid || "test_uid_" + Date.now(),
      fullName: fullName || "Test User",
      email: email || "test@example.com",
      profilePicture: profilePicture || "",
      walletBalance: 0,
      mpinStatus: "Not Set",
      linkedBanks: [],
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const result = await usersCollection.insertOne(testUser)
    
    return NextResponse.json({
      message: "Test user created successfully",
      insertedId: result.insertedId,
      user: testUser
    })
  } catch (error) {
    console.error("Test user creation failed:", error)
    return NextResponse.json(
      { error: "Test user creation failed", details: error },
      { status: 500 }
    )
  }
}
