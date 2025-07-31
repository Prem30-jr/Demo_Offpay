import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, fullName, email, profilePicture } = await request.json()

    if (!firebaseUid || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ firebaseUid })

    if (existingUser) {
      // Update existing user
      const result = await usersCollection.findOneAndUpdate(
        { firebaseUid },
        {
          $set: {
            fullName,
            email,
            profilePicture,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      )

      if (result.value) {
        // Convert MongoDB document to plain object
        const updatedUser = JSON.parse(JSON.stringify(result.value))
        return NextResponse.json(updatedUser)
      } else {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        )
      }
    } else {
      // Create new user
      const newUser: Omit<User, "_id"> = {
        firebaseUid,
        fullName,
        email,
        profilePicture: profilePicture || "",
        walletBalance: 0,
        mpinStatus: "Not Set",
        linkedBanks: [],
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await usersCollection.insertOne(newUser)
      const createdUser = await usersCollection.findOne({ _id: result.insertedId })

      if (createdUser) {
        // Convert MongoDB document to plain object
        const userData = JSON.parse(JSON.stringify(createdUser))
        return NextResponse.json(userData, { status: 201 })
      } else {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error("Error handling user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

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

    // Convert MongoDB document to plain object
    const userData = JSON.parse(JSON.stringify(user))
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 