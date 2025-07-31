import { MongoClient, ServerApiVersion } from "mongodb"

// IMPORTANT: Create a .env.local file in your project root with the correct MongoDB credentials
// Example .env.local content:
// MONGODB_URI=mongodb+srv://your_actual_username:your_actual_password@your-cluster.mongodb.net/?retryWrites=true&w=majority
// MONGODB_DB_NAME=qr_payment_app

const uri = process.env.MONGODB_URI || "mongodb+srv://prem3010057:prem3010057@prem-cluster24.w1ozvvr.mongodb.net/?retryWrites=true&w=majority&appName=Prem-Cluster24"
const dbName = process.env.MONGODB_DB_NAME || "qr_payment_app"

// Only log configuration in development or when explicitly requested
if (process.env.NODE_ENV === 'development') {
  console.log("MongoDB Configuration:", {
    hasEnvUri: !!process.env.MONGODB_URI,
    hasEnvDbName: !!process.env.MONGODB_DB_NAME,
    dbName,
    uriPreview: uri.substring(0, 50) + "..."
  })
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

async function connectToDatabase() {
  try {
    if (client && client.topology?.isConnected()) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Using existing MongoDB connection")
      }
      return { client, db: client.db(dbName) }
    }

    if (!clientPromise) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Creating new MongoDB connection...")
      }
      clientPromise = MongoClient.connect(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
    }

    client = await clientPromise
    if (process.env.NODE_ENV === 'development') {
      console.log("Successfully connected to MongoDB!")
    }
    
    // Test the connection
    await client.db(dbName).admin().ping()
    if (process.env.NODE_ENV === 'development') {
      console.log("Database ping successful!")
    }
    
    return { client, db: client.db(dbName) }
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e)
    clientPromise = null
    client = null
    
    // Provide helpful error messages
    if (e instanceof Error) {
      if (e.message.includes("bad auth")) {
        console.error("🔴 MongoDB Authentication Error!")
        console.error("Please check your username and password in the connection string")
        console.error("Create a .env.local file with correct MONGODB_URI")
        console.error("Current URI format: mongodb+srv://username:password@cluster.mongodb.net/")
      } else if (e.message.includes("ECONNREFUSED")) {
        console.error("🔴 MongoDB Connection Error: Unable to connect to the database server")
      } else if (e.message.includes("ENOTFOUND")) {
        console.error("🔴 MongoDB DNS Error: Unable to resolve the database hostname")
      } else if (e.message.includes("ETIMEDOUT")) {
        console.error("🔴 MongoDB Timeout Error: Connection timed out")
      }
    }
    
    throw e
  }
}

export default connectToDatabase
