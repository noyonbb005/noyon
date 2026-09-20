import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfigData from '../firebase-applet-config.json';

// Exact Firebase config provided by user & applet config
export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || "AIzaSyAHxCCdVDO5NyvgDskhvrqdRQKOJcCIOh4",
  authDomain: firebaseConfigData.authDomain || "noyon-c-p.firebaseapp.com",
  projectId: firebaseConfigData.projectId || "noyon-c-p",
  storageBucket: firebaseConfigData.storageBucket || "noyon-c-p.firebasestorage.app",
  messagingSenderId: firebaseConfigData.messagingSenderId || "1071673050555",
  appId: "1:1071673050555:web:ed6c8126a6715bafbff09e",
  measurementId: "G-RSPNWDKWL4",
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const firestoreDbId = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? firebaseConfigData.firestoreDatabaseId
  : undefined;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  }, firestoreDbId);
} catch {
  firestoreInstance = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
}

export const db = firestoreInstance;

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Ensure anonymous authentication for reliable database access
export const initAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        resolve(currentUser);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (err) {
          console.warn('Firebase anonymous auth optional fallback:', err);
          resolve(null);
        }
      }
    });
  });
};

/**
 * Upload a product image file or blob to Firebase Storage
 * returns the public download URL
 */
export async function uploadProductImage(file: File | Blob, customFilename?: string): Promise<string> {
  const extension = file.type ? file.type.split('/')[1] || 'jpg' : 'jpg';
  const fileName = customFilename || `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const storageRef = ref(storage, `products/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
