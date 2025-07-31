import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, mpin, action } = await request.json()

    console.log("MPIN API called:", { firebaseUid, action, mpinLength: mpin?.length })

    if (!firebaseUid || !mpin || !action) {
      console.error("Missing required fields:", { firebaseUid: !!firebaseUid, mpin: !!mpin, action: !!action })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("Connecting to database...")
    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    console.log("Checking if user exists in database...")
    const existingUser = await usersCollection.findOne({ firebaseUid })
    console.log("User exists:", !!existingUser)

    if (action === "setup") {
      // Set up MPIN for the first time
      if (!existingUser) {
        console.error("User not found in database for MPIN setup:", firebaseUid)
        return NextResponse.json(
          { error: "User not found. Please try signing in again." },
          { status: 404 }
        )
      }

      const result = await usersCollection.findOneAndUpdate(
        { firebaseUid },
        {
          $set: {
            mpin: mpin, // Store the actual MPIN (in production, this should be hashed)
            mpinStatus: "Set",
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      )

      if (!result.value) {
        console.error("Failed to update user with MPIN:", firebaseUid)
        return NextResponse.json(
          { error: "Failed to set MPIN. Please try again." },
          { status: 500 }
        )
      }

      console.log("MPIN setup successful for user:", firebaseUid)
      return NextResponse.json({
        success: true,
        message: "MPIN set successfully",
        mpinStatus: "Set"
      })

    } else if (action === "verify") {
      // Verify MPIN
      if (!existingUser) {
        console.error("User not found in database for MPIN verification:", firebaseUid)
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      if (existingUser.mpinStatus !== "Set") {
        console.error("MPIN not set for user:", firebaseUid)
        return NextResponse.json(
          { error: "MPIN not set" },
          { status: 400 }
        )
      }

      console.log("Verifying MPIN:", { 
        provided: mpin, 
        stored: existingUser.mpin, 
        match: existingUser.mpin === mpin 
      })

      if (existingUser.mpin === mpin) {
        return NextResponse.json({
          success: true,
          message: "MPIN verified successfully"
        })
      } else {
        return NextResponse.json(
          { error: "Incorrect MPIN" },
          { status: 401 }
        )
      }

    } else if (action === "change") {
      // Change existing MPIN
      if (!existingUser) {
        console.error("User not found in database for MPIN change:", firebaseUid)
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      if (existingUser.mpinStatus !== "Set") {
        console.error("MPIN not set for user during change:", firebaseUid)
        return NextResponse.json(
          { error: "MPIN not set" },
          { status: 400 }
        )
      }

      const result = await usersCollection.findOneAndUpdate(
        { firebaseUid },
        {
          $set: {
            mpin: mpin,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      )

      if (!result.value) {
        console.error("Failed to update MPIN for user:", firebaseUid)
        return NextResponse.json(
          { error: "Failed to update MPIN. Please try again." },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "MPIN changed successfully"
      })

    } else {
      console.error("Invalid action:", action)
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Error handling MPIN:", error)
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

    return NextResponse.json({
      mpinStatus: user.mpinStatus,
      hasMpin: user.mpinStatus === "Set"
    })

  } catch (error) {
    console.error("Error fetching MPIN status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 