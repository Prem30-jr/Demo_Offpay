import { NextResponse } from "next/server"
import { MongoClient, ServerApiVersion } from "mongodb"

export async function GET() {
  try {
    // Get the connection string from environment
    const uri = process.env.MONGODB_URI || "mongodb+srv://prem3010057:prem3010057@prem-cluster24.w1ozvvr.mongodb.net/?retryWrites=true&w=majority&appName=Prem-Cluster24"
    
    console.log("🔍 Testing MongoDB connection...")
    console.log("URI (masked):", uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"))
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })

    await client.connect()
    console.log("✅ MongoDB connection successful!")
    
    const db = client.db("qr_payment_app")
    const collections = await db.listCollections().toArray()
    
    await client.close()
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful!",
      collections: collections.map(col => col.name),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    
    let errorMessage = "Unknown error"
    let suggestions = []
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if (error.message.includes("bad auth")) {
        suggestions = [
          "Check your username and password in .env.local",
          "Make sure you're using the database user password, not your Atlas account password",
          "Verify the user has read/write permissions",
          "Try creating a new database user in MongoDB Atlas"
        ]
      } else if (error.message.includes("ECONNREFUSED")) {
        suggestions = [
          "Check your internet connection",
          "Verify the cluster is running",
          "Check if your IP is whitelisted in MongoDB Atlas"
        ]
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 