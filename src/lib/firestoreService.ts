import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, initAuth } from './firebase';
import { Product, Order, Customer, StoreSettings } from '../types';

export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const CUSTOMERS_COLLECTION = 'customers';
export const SETTINGS_COLLECTION = 'settings';
export const SETTINGS_DOC_ID = 'store_config';

/**
 * Clean object of any undefined values before sending to Firestore
 */
function sanitizeDoc<T extends Record<string, any>>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

// ---------------- PRODUCTS ----------------

/**
 * Real-time listener for products from Firestore
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Product);
      });
      onData(list);
    },
    (err) => {
      console.error('Firestore products listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Add or update a product in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  await initAuth();
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(docRef, sanitizeDoc(product), { merge: true });
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  await initAuth();
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Batch delete products
 */
export async function batchDeleteProductsFromFirestore(productIds: string[]): Promise<void> {
  await initAuth();
  const batch = writeBatch(db);
  for (const id of productIds) {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    batch.delete(docRef);
  }
  await batch.commit();
}

/**
 * Seed initial products into Firestore if the collection is empty
 */
export async function seedInitialProductsIfEmpty(initialProducts: Product[]): Promise<void> {
  try {
    await initAuth();
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && initialProducts.length > 0) {
      const batch = writeBatch(db);
      for (const p of initialProducts) {
        const docRef = doc(db, PRODUCTS_COLLECTION, p.id);
        batch.set(docRef, sanitizeDoc(p));
      }
      await batch.commit();
      console.log('Seeded default products into Firebase Firestore.');
    }
  } catch (err) {
    console.warn('Seed products check:', err);
  }
}

// ---------------- ORDERS ----------------

/**
 * Real-time listener for orders from Firestore
 */
export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      // Sort newest first
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onData(list);
    },
    (err) => {
      console.error('Firestore orders listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Add or update order in Firestore
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  await initAuth();
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(docRef, sanitizeDoc(order), { merge: true });
}

/**
 * Update order status in Firestore
 */
export async function updateOrderStatusInFirestore(orderId: string, status: string): Promise<void> {
  await initAuth();
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, { status });
}

/**
 * Delete order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  await initAuth();
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(docRef);
}

/**
 * Seed initial orders if empty
 */
export async function seedInitialOrdersIfEmpty(initialOrders: Order[]): Promise<void> {
  try {
    await initAuth();
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && initialOrders.length > 0) {
      const batch = writeBatch(db);
      for (const o of initialOrders) {
        const docRef = doc(db, ORDERS_COLLECTION, o.id);
        batch.set(docRef, sanitizeDoc(o));
      }
      await batch.commit();
      console.log('Seeded default orders into Firebase Firestore.');
    }
  } catch (err) {
    console.warn('Seed orders check:', err);
  }
}

// ---------------- CUSTOMERS ----------------

/**
 * Real-time listener for customers
 */
export function subscribeToCustomers(
  onData: (customers: Customer[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, CUSTOMERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Customer[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Customer);
      });
      onData(list);
    },
    (err) => {
      console.error('Firestore customers listener error:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveCustomerToFirestore(customer: Customer): Promise<void> {
  await initAuth();
  const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await setDoc(docRef, sanitizeDoc(customer), { merge: true });
}

export async function seedInitialCustomersIfEmpty(initialCustomers: Customer[]): Promise<void> {
  try {
    await initAuth();
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && initialCustomers.length > 0) {
      const batch = writeBatch(db);
      for (const c of initialCustomers) {
        const docRef = doc(db, CUSTOMERS_COLLECTION, c.id);
        batch.set(docRef, sanitizeDoc(c));
      }
      await batch.commit();
      console.log('Seeded default customers into Firebase Firestore.');
    }
  } catch (err) {
    console.warn('Seed customers check:', err);
  }
}

// ---------------- SETTINGS ----------------

export function subscribeToSettings(
  onData: (settings: StoreSettings) => void,
  onError?: (err: any) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as StoreSettings);
      }
    },
    (err) => {
      console.error('Firestore settings listener error:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveSettingsToFirestore(settings: StoreSettings): Promise<void> {
  await initAuth();
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, sanitizeDoc(settings), { merge: true });
}
