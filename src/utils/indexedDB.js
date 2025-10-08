const DB_NAME = "TimeTravelPlaygroundDB"; // Database name
const DB_VERSION = 1; // Database version
const STORE_NAME = "codeHistory"; // Object store's name

class IndexedDBHelper {
    constructor() {
        this.db = null;
    }

    // Open or create the database 
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(STORE_NAME)) {
                    this.db.createObjectStore(STORE_NAME, {
                        keyPath: "id", // Using 'id' as the key
                        autoIncrement: true, // Auto-generate keys
                    });
                }
            } 
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = (event) => {
                reject(`Error opening database: ${event.target.error}`);
            };
        });     
    }

    // Adding snapshot of the code to the database
    addSnapshot(snapshot) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            const request = store.add(snapshot);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

    }

    // Get snapshots of the code from database
    getAllSnapshots() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

    }
    
    // Close the database connection
    closeDB() {
        if (this.db) {
        this.db.close();
        this.db = null;
        }
    }
}

// Export a singleton instance of the helper
const dbHelper = new IndexedDBHelper();
export default dbHelper;