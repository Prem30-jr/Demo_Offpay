import connectToDatabase from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    const { db } = await connectToDatabase()
    let users

    if (query) {
      // Search by email or fullName
      users = await db.collection("users").find({
        $or: [
          { email: { $regex: query, $options: "i" } },
          { fullName: { $regex: query, $options: "i" } }
        ]
      }).toArray()
    } else {
      users = await db.collection("users").find({}).toArray()
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const userData = await request.json()

    const newUser = {
      ...userData,
      _id: userData.id || `user_${Date.now()}`,
      firebaseUid: userData.firebaseUid || "",
      walletBalance: userData.walletBalance || 0,
      mpinStatus: userData.mpinStatus || "Not Set",
      linkedBanks: userData.linkedBanks || [],
      isProfileComplete: userData.isProfileComplete || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("users").insertOne(newUser)

    return NextResponse.json({ success: true, insertedId: result.insertedId })
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id, ...updateData } = await request.json()

    const result = await db.collection("users").updateOne(
      { _id: id }, 
      { 
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await request.json()

    const result = await db.collection("users").deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
