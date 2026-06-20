import { db, initializeResumeInFirestore, initializeAdminConfigInFirestore, updateAdminConfigInFirestore } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { RESUME_DATA } from "../types";

type UpdateListener = () => void;
const listeners = new Set<UpdateListener>();

export const dbSync = {
  isLoaded: false,
  error: null as string | null,
  adminPassword: "deepAnsh2134",

  // Subscribe to updates (forces React rerender)
  subscribe(listener: UpdateListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in listener: ", err);
      }
    });
  },

  // Load from Firestore and update the global RESUME_DATA reference
  async loadResume() {
    try {
      this.error = null;
      console.log("Fetching resume from firestore...");
      
      // Load resume data and admin configuration in parallel
      const [firestoreData, adminConfig] = await Promise.all([
        initializeResumeInFirestore(RESUME_DATA),
        initializeAdminConfigInFirestore()
      ]);
      
      if (adminConfig && adminConfig.adminPassword) {
        this.adminPassword = adminConfig.adminPassword;
      }
      
      if (firestoreData) {
        // Deep copy properties from Firestore to the exported RESUME_DATA ref
        if (firestoreData.personalInfo) {
          Object.assign(RESUME_DATA.personalInfo, firestoreData.personalInfo);
        }
        if (Array.isArray(firestoreData.education)) {
          RESUME_DATA.education = [...firestoreData.education];
        }
        if (Array.isArray(firestoreData.experiences)) {
          RESUME_DATA.experiences = [...firestoreData.experiences];
        }
        if (Array.isArray(firestoreData.projects)) {
          RESUME_DATA.projects = [...firestoreData.projects];
        }
        if (Array.isArray(firestoreData.skills)) {
          RESUME_DATA.skills = [...firestoreData.skills];
        }
        if (Array.isArray(firestoreData.achievements)) {
          RESUME_DATA.achievements = [...firestoreData.achievements];
        }
        if (Array.isArray(firestoreData.coCurricular)) {
          RESUME_DATA.coCurricular = [...firestoreData.coCurricular];
        }
        if (firestoreData.terminal) {
          (RESUME_DATA as any).terminal = JSON.parse(JSON.stringify(firestoreData.terminal));
        }
        
        this.isLoaded = true;
        this.notify();
      }
    } catch (err: any) {
      console.error("Failed to sync with Firestore: ", err);
      this.error = err.message || "Unknown error";
      this.notify();
    }
  },

  // Save updated local resume state to Firestore
  async saveResume(updatedData: typeof RESUME_DATA) {
    try {
      this.error = null;
      const docRef = doc(db, "portfolio", "resume");
      await updateDoc(docRef, updatedData);
      
      // Update local values and notify
      Object.assign(RESUME_DATA.personalInfo, updatedData.personalInfo);
      RESUME_DATA.education = [...updatedData.education];
      RESUME_DATA.experiences = [...updatedData.experiences];
      RESUME_DATA.projects = [...updatedData.projects];
      RESUME_DATA.skills = [...updatedData.skills];
      RESUME_DATA.achievements = [...updatedData.achievements];
      RESUME_DATA.coCurricular = [...updatedData.coCurricular];
      if ((updatedData as any).terminal) {
        (RESUME_DATA as any).terminal = JSON.parse(JSON.stringify((updatedData as any).terminal));
      }
      
      this.notify();
    } catch (err: any) {
      console.error("Failed to save to Firestore: ", err);
      this.error = err.message || "Failed to save";
      throw err;
    }
  },

  // Save updated admin password to Firestore config document
  async saveAdminPassword(newPassword: string) {
    try {
      this.error = null;
      await updateAdminConfigInFirestore({ adminPassword: newPassword });
      this.adminPassword = newPassword;
      this.notify();
    } catch (err: any) {
      console.error("Failed to update admin password: ", err);
      this.error = err.message || "Failed to update admin password";
      throw err;
    }
  }
};
