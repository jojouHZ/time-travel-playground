import { getEnv } from '../utils/env';

const { DB_NAME, DB_VERSION, STORE_NAME } = getEnv();
let db: IDBDatabase | null = null;

const openDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const addSnapshot = (snapshot: {
  code: string;
  timestamp: string;
}): Promise<IDBValidKey> => {
  if (!db) {
    throw new Error('Database not opened. Call openDB() first.');
  }

  const currentDB = db;
  return new Promise((resolve, reject) => {
    const transaction = currentDB.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(snapshot);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAllSnapshots = (): Promise<
  Array<{ code: string; timestamp: string }>
> => {
  if (!db) {
    throw new Error('Database not opened. Call openDB() first.');
  }

  const currentDB = db;
  return new Promise((resolve, reject) => {
    const transaction = currentDB.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const clearSnapshots = (): Promise<void> => {
  if (!db) {
    throw new Error('Database not opened. Call openDB() first.');
  }

  const currentDB = db;
  return new Promise((resolve, reject) => {
    const transaction = currentDB.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const closeDB = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};

export { openDB, addSnapshot, getAllSnapshots, clearSnapshots, closeDB };
