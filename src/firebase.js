/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "@firebase/database";
import "firebase/compat/auth";
import "firebase/auth";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8-_ktKoGnG87bJksBu06_o489Xj8V6tU" || process.env.API_KEY,
  authDomain: "ait-lucky-app.firebaseapp.com" || process.env.AUTH_DOMAIN,
  databaseURL:
    "https://ait-lucky-app-default-rtdb.asia-southeast1.firebasedatabase.app" ||
    process.env.DB_URL,
  projectId: "ait-lucky-app" || process.env.PROJECT_ID,
  storageBucket: "ait-lucky-app.appspot.com" || process.env.STORAGE_BUCKET,
  messagingSenderId: "722133037936" || process.env.MESSAGE_SENDER_ID,
  appId: "1:722133037936:web:501e76a24dca2af4fd55b5" || process.env.APP_ID,
  measurementId: "G-S0QRME7VTZ" || process.env.MEASUREMENT_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
// const storageRef = ref(storage)
export { app, auth, db, storage };
