import { NextResponse } from "next/server"

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://prem3010057:prem3010057@prem-cluster24.w1ozvvr.mongodb.net/?retryWrites=true&w=majority&appName=Prem-Cluster24"
    
    // Extract username from the URI
    const usernameMatch = uri.match(/\/\/([^:]+):/)
    const username = usernameMatch ? usernameMatch[1] : "unknown"
    
    // Create a template connection string
    const templateUri = uri.replace(/\/\/[^:]+:[^@]+@/, `//${username}:<password>@`)
    
    return NextResponse.json({
      success: true,
      message: "Use this connection string format in MongoDB Compass",
      connectionString: templateUri,
      username: username,
      cluster: "prem-cluster24.w1ozvvr.mongodb.net",
      database: process.env.MONGODB_DB_NAME || "qr_payment_app",
      instructions: [
        "1. Copy the connectionString above",
        "2. Replace <password> with your actual password",
        "3. Paste it into MongoDB Compass",
        "4. Make sure to use the same password as in your .env.local file"
      ]
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to get connection info"
    }, { status: 500 })
  }
} 