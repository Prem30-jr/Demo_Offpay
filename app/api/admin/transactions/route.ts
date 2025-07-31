import connectToDatabase from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get transactions with user details
    const transactions = await db
      .collection("transactions")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "senderDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiverDetails",
          },
        },
        {
          $addFields: {
            senderName: { $arrayElemAt: ["$senderDetails.fullName", 0] },
            receiverName: { $arrayElemAt: ["$receiverDetails.fullName", 0] },
          },
        },
        {
          $project: {
            senderDetails: 0,
            receiverDetails: 0,
          },
        },
        {
          $sort: { timestamp: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const transactionData = await request.json()

    const newTransaction = {
      ...transactionData,
      _id: transactionData.id || `tx_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: transactionData.status || "Pending",
    }

    const result = await db.collection("transactions").insertOne(newTransaction)

    return NextResponse.json({ success: true, insertedId: result.insertedId })
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id, ...updateData } = await request.json()

    const result = await db.collection("transactions").updateOne({ _id: id }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("Failed to update transaction:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}
