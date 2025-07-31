import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, fullName, email, profilePicture } = await request.json()

    console.log("User creation request:", { firebaseUid, fullName, email, profilePicture })

    if (!firebaseUid || !fullName || !email) {
      console.error("Missing required fields:", { firebaseUid: !!firebaseUid, fullName: !!fullName, email: !!email })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("Connecting to database...")
    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    console.log("Checking if user already exists...")
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ firebaseUid })
    console.log("Existing user found:", !!existingUser)

    if (existingUser) {
      console.log("Updating existing user...")
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
        console.log("User updated successfully")
        // Convert MongoDB document to plain object
        const updatedUser = JSON.parse(JSON.stringify(result.value))
        return NextResponse.json(updatedUser)
      } else {
        console.error("Failed to update user - no result returned")
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        )
      }
    } else {
      console.log("Creating new user...")
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

      console.log("New user object:", newUser)

      const result = await usersCollection.insertOne(newUser)
      console.log("User inserted with ID:", result.insertedId)

      const createdUser = await usersCollection.findOne({ _id: result.insertedId })

      if (createdUser) {
        console.log("User created successfully")
        // Convert MongoDB document to plain object
        const userData = JSON.parse(JSON.stringify(createdUser))
        return NextResponse.json(userData, { status: 201 })
      } else {
        console.error("Failed to retrieve created user")
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error("Error handling user:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firebaseUid = searchParams.get("firebaseUid")

    console.log("Fetching user:", firebaseUid)

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
      console.log("User not found:", firebaseUid)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    console.log("User found:", firebaseUid)
    // Convert MongoDB document to plain object
    const userData = JSON.parse(JSON.stringify(user))
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 