import connectToDatabase from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const bankLinks = await db.collection("bank_details").find({}).toArray()

    return NextResponse.json(bankLinks)
  } catch (error) {
    console.error("Failed to fetch bank links:", error)
    return NextResponse.json({ error: "Failed to fetch bank links" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const bankLinkData = await request.json()

    const newBankLink = {
      ...bankLinkData,
      _id: bankLinkData.id || `bl_${Date.now()}`,
      isVerified: bankLinkData.isVerified || false,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("bank_details").insertOne(newBankLink)

    return NextResponse.json({ success: true, insertedId: result.insertedId })
  } catch (error) {
    console.error("Failed to create bank link:", error)
    return NextResponse.json({ error: "Failed to create bank link" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id, ...updateData } = await request.json()

    const result = await db.collection("bank_details").updateOne({ _id: id }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Bank link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("Failed to update bank link:", error)
    return NextResponse.json({ error: "Failed to update bank link" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await request.json()

    const result = await db.collection("bank_details").deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bank link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    console.error("Failed to delete bank link:", error)
    return NextResponse.json({ error: "Failed to delete bank link" }, { status: 500 })
  }
}
