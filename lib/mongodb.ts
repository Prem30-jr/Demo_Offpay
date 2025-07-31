import { MongoClient, ServerApiVersion } from "mongodb"

// IMPORTANT: Create a .env.local file in your project root with the correct MongoDB credentials
// Example .env.local content:
// MONGODB_URI=mongodb+srv://your_actual_username:your_actual_password@your-cluster.mongodb.net/?retryWrites=true&w=majority
// MONGODB_DB_NAME=qr_payment_app

const uri = process.env.MONGODB_URI || "mongodb+srv://prem3010057:prem3010057@prem-cluster24.w1ozvvr.mongodb.net/?retryWrites=true&w=majority&appName=Prem-Cluster24"
const dbName = process.env.MONGODB_DB_NAME || "qr_payment_app"

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

async function connectToDatabase() {
  if (client) {
    return { client, db: client.db(dbName) }
  }

  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  }

  try {
    client = await clientPromise
    console.log("Successfully connected to MongoDB!")
    return { client, db: client.db(dbName) }
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e)
    clientPromise = null
    
    // Provide helpful error messages
    if (e instanceof Error) {
      if (e.message.includes("bad auth")) {
        console.error("🔴 MongoDB Authentication Error!")
        console.error("Please check your username and password in the connection string")
        console.error("Create a .env.local file with correct MONGODB_URI")
        console.error("Current URI format: mongodb+srv://username:password@cluster.mongodb.net/")
      } else if (e.message.includes("ECONNREFUSED")) {
        console.error("🔴 MongoDB Connection Error: Unable to connect to the database server")
      }
    }
    
    throw e
  }
}

export default connectToDatabase
