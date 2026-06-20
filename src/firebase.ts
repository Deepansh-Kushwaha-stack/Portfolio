import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBi-1_JSeyNxiENvAcNIBuwlnccUh2dQHk",
  authDomain: "kempt-coast-90bnn.firebaseapp.com",
  projectId: "kempt-coast-90bnn",
  storageBucket: "kempt-coast-90bnn.firebasestorage.app",
  messagingSenderId: "257972056871",
  appId: "1:257972056871:web:dac8ffa868d6e65d022f02"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId from configuration
export const db = getFirestore(app, "ai-studio-3bef81bd-c430-4d1a-a95c-54ba7176988b");

// Helper to check if admin config exists or to initialize it with default "deepAnsh2134"
export async function initializeAdminConfigInFirestore() {
  try {
    const docRef = doc(db, "portfolio", "config");
    const docSnap = await getDoc(docRef);
    const defaultConfig = {
      adminPassword: "deepAnsh2134",
      lastUpdated: new Date().toISOString()
    };
    if (!docSnap.exists()) {
      console.log("No config data in Firestore. Initializing with default config...");
      await setDoc(docRef, defaultConfig);
      return defaultConfig;
    } else {
      console.log("Admin config found in Firestore.");
      const data = docSnap.data();
      if (!data || !data.adminPassword) {
        await setDoc(docRef, defaultConfig);
        return defaultConfig;
      }
      return data;
    }
  } catch (error) {
    console.error("Error checking/initializing admin config: ", error);
    return {
      adminPassword: "deepAnsh2134",
      lastUpdated: new Date().toISOString()
    };
  }
}

// Helper to update admin config
export async function updateAdminConfigInFirestore(updatedConfig: { adminPassword: string }) {
  try {
    const docRef = doc(db, "portfolio", "config");
    await updateDoc(docRef, {
      ...updatedConfig,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating admin config: ", error);
    throw error;
  }
}

// Helper to check if a collection exists or to initialize the resume data
export async function initializeResumeInFirestore(defaultData: any) {
  try {
    const docRef = doc(db, "portfolio", "resume");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("No resume data in Firestore. Initializing with default resume...");
      await setDoc(docRef, defaultData);
      return defaultData;
    } else {
      console.log("Resume found in Firestore.");
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error checking/initializing resume: ", error);
    return defaultData;
  }
}

// Helper to save contact message
export async function saveContactMessage(messageData: any) {
  try {
    const colRef = collection(db, "messages");
    const docRef = await addDoc(colRef, {
      ...messageData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving message: ", error);
    throw error;
  }
}
