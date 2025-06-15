// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6BFfrTIeNVWQLV8dg_824Mm1y1X5jd4c",
  authDomain: "lotus-mens.firebaseapp.com",
  projectId: "lotus-mens",
  storageBucket: "lotus-mens.firebasestorage.app",
  messagingSenderId: "454852482854",
  appId: "1:454852482854:web:64bae49af3cb69790d93e7",
  measurementId: "G-ZZ3K5EQC9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save order to Firestore
export async function saveOrder(orderData) {
  try {
    // Add to orders collection with order number as document ID
    await setDoc(doc(db, "orders", orderData.order_number), orderData);
    
    // Also add to daily orders collection
    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, "orders_by_date", today, "daily_orders", orderData.order_number), orderData);
    
    console.log("Order saved successfully!");
    return true;
  } catch (error) {
    console.error("Error saving order:", error);
    return false;
  }
}

// Function to generate random order number (if needed)
export function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
} 