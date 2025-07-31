import { getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// IMPORTANT: For production, use environment variables for your Firebase config.
// Example: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSyDmw-JztV4TGZQBm1QuVg-90aQXE50XPVU",
  authDomain: "offlinepayapp.firebaseapp.com",
  projectId: "offlinepayapp",
  storageBucket: "offlinepayapp.firebasestorage.app",
  messagingSenderId: "19254919378",
  appId: "1:19254919378:web:e723be425fe2b778d2ad0b",
  measurementId: "G-P21XBKR7TK",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider for better UX
googleProvider.setCustomParameters({
  prompt: "select_account",
})

export default app
