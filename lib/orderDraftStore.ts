// lib/orderDraftStore.ts
// IndexedDB store so multi-card orders with original photos + BG-removed cutouts + card previews
// never exceed browser localStorage's 5MB limit across Stripe redirects.

const DB_NAME = "sas-sports-order-db";
const STORE_NAME = "drafts";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, value: any): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

async function idbGet<T = any>(key: string): Promise<T | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        const res = (req.result as T) ?? null;
        db.close();
        resolve(res);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

export async function saveCartDraft(items: any[]): Promise<void> {
  await idbSet("cardsplug-cart", items);
  try {
    localStorage.setItem("cardsplug-cart", JSON.stringify(items));
  } catch {
    // Ignore QuotaExceededError — IndexedDB holds the full high-res payload
  }
}

export async function loadCartDraft(): Promise<any[] | null> {
  const fromIdb = await idbGet<any[]>("cardsplug-cart");
  if (Array.isArray(fromIdb) && fromIdb.length > 0) {
    return fromIdb;
  }
  try {
    const raw = localStorage.getItem("cardsplug-cart");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return fromIdb ?? null;
}

export async function clearCartDraft(): Promise<void> {
  await idbDelete("cardsplug-cart");
  try {
    localStorage.removeItem("cardsplug-cart");
  } catch {}
}

export async function savePendingCustomerDraft(customer: any): Promise<void> {
  await idbSet("cardsplug-pending-customer", customer);
  try {
    localStorage.setItem("cardsplug-pending-customer", JSON.stringify(customer));
  } catch {}
}

export async function loadPendingCustomerDraft(): Promise<any | null> {
  const fromIdb = await idbGet<any>("cardsplug-pending-customer");
  if (fromIdb) return fromIdb;
  try {
    const raw = localStorage.getItem("cardsplug-pending-customer");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export async function clearPendingCustomerDraft(): Promise<void> {
  await idbDelete("cardsplug-pending-customer");
  try {
    localStorage.removeItem("cardsplug-pending-customer");
  } catch {}
}
