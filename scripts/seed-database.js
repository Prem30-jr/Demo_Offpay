const { MongoClient, ServerApiVersion } = require("mongodb")

const uri =
  "mongodb+srv://prem3010057:prem3010057@prem-cluster24.w1ozvvr.mongodb.net/?retryWrites=true&w=majority&appName=Prem-Cluster24"
const dbName = "qr_payment_app"

const sampleUsers = [
  {
    _id: "user1",
    fullName: "Alice Johnson",
    email: "alice@example.com",
    walletBalance: 1500.5,
    linkedBank: "HDFC Bank",
    mpinStatus: "Set",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "user2",
    fullName: "Bob Williams",
    email: "bob@example.com",
    walletBalance: 2300.75,
    linkedBank: "State Bank of India",
    mpinStatus: "Not Set",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "user3",
    fullName: "Charlie Brown",
    email: "charlie@example.com",
    walletBalance: 850.25,
    linkedBank: "ICICI Bank",
    mpinStatus: "Set",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "user4",
    fullName: "Diana Prince",
    email: "diana@example.com",
    walletBalance: 3200.0,
    linkedBank: "Axis Bank",
    mpinStatus: "Set",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "user5",
    fullName: "Eve Davis",
    email: "eve@example.com",
    walletBalance: 450.8,
    mpinStatus: "Not Set",
    createdAt: new Date().toISOString(),
  },
]

const sampleTransactions = [
  {
    _id: "tx1",
    senderId: "user1",
    receiverId: "user3",
    amount: 100.0,
    timestamp: "2024-07-29T10:00:00Z",
    status: "Success",
    type: "Sent",
  },
  {
    _id: "tx2",
    senderId: "user3",
    receiverId: "user1",
    amount: 50.0,
    timestamp: "2024-07-29T11:00:00Z",
    status: "Success",
    type: "Received",
  },
  {
    _id: "tx3",
    senderId: "user2",
    receiverId: "user4",
    amount: 200.0,
    timestamp: "2024-07-28T15:30:00Z",
    status: "Failed",
    type: "Sent",
  },
  {
    _id: "tx4",
    senderId: "user5",
    receiverId: "user2",
    amount: 75.0,
    timestamp: "2024-07-28T09:00:00Z",
    status: "Success",
    type: "Received",
  },
  {
    _id: "tx5",
    senderId: "user1",
    receiverId: "user5",
    amount: 120.0,
    timestamp: "2024-07-27T18:00:00Z",
    status: "Success",
    type: "Sent",
  },
]

const sampleBankLinks = [
  {
    _id: "bl1",
    userId: "user1",
    userName: "Alice Johnson",
    bankName: "HDFC Bank",
    accountNumber: "****1234",
    isVerified: true,
  },
  {
    _id: "bl2",
    userId: "user2",
    userName: "Bob Williams",
    bankName: "State Bank of India",
    accountNumber: "****5678",
    isVerified: false,
  },
  {
    _id: "bl3",
    userId: "user3",
    userName: "Charlie Brown",
    bankName: "ICICI Bank",
    accountNumber: "****9012",
    isVerified: true,
  },
  {
    _id: "bl4",
    userId: "user4",
    userName: "Diana Prince",
    bankName: "Axis Bank",
    accountNumber: "****3456",
    isVerified: true,
  },
]

async function seedDatabase() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db(dbName)

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("transactions").deleteMany({})
    await db.collection("bank_details").deleteMany({})

    // Insert sample data
    await db.collection("users").insertMany(sampleUsers)
    await db.collection("transactions").insertMany(sampleTransactions)
    await db.collection("bank_details").insertMany(sampleBankLinks)

    console.log("Database seeded successfully!")
    console.log(`Inserted ${sampleUsers.length} users`)
    console.log(`Inserted ${sampleTransactions.length} transactions`)
    console.log(`Inserted ${sampleBankLinks.length} bank links`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
