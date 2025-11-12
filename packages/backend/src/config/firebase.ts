// src/config/firebase.ts
import admin from "firebase-admin";
 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let firebaseApp: any;

if (process.env.NODE_ENV === "development") {
  firebaseApp = {
    messaging: () => ({
      send: async (msg: any) => {
        console.log("📩 Mock send message:", msg);
        return "mock-message-id";
      }
    }),
    auth: () => ({
      verifyIdToken: async () => ({ uid: "fake-user", email: "test@example.com" })
    })
  };
  console.log("⚡ Using mock Firebase in development");
} else {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  console.log("✅ Firebase initialized");
}

export { firebaseApp };
