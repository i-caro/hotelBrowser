export class LocalDatabase<T> {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;
  
    constructor(dbName: string, storeName: string) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.init();
    }
  
    async init(): Promise<void> {
      if (this.db) return; 
    
      return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
    
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('services')) {
            db.createObjectStore('services', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('bookings')) {
            db.createObjectStore('bookings', { keyPath: 'id' });
          }
        };
    
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve();
        };
    
        request.onerror = () => {
          reject(`Error initializing database ${this.dbName}`);
        };
      });
    }
  
    async add(item: T): Promise<string> {
      await this.init();
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject("Database is not initialized");
          return;
        }
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.add(item);
  
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
  
        request.onerror = () => {
          reject("Error adding item to database");
        };
      });
    }
  
    async getAll(): Promise<T[]> {
      await this.init();
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject("Database is not initialized");
          return;
        }
        const transaction = this.db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
  
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
  
        request.onerror = () => {
          reject("Error retrieving items from database");
        };
      });
    }

    async getById( id: string): Promise<T> {
      await this.init();
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject('Base de datos no inicializada');
          return;
        }
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
  
        request.onsuccess = () => {
          resolve(request.result as T);
        };
  
        request.onerror = (error) => {
          reject(error);
        };
      });
    }
  
    async update(item: T): Promise<void> {
      await this.init();
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject("Database is not initialized");
          return;
        }
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(item);
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject("Error updating item in database");
        };
      });
    }
  
    async delete(id: string): Promise<void> {
      await this.init();
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject("Database is not initialized");
          return;
        }
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject("Error deleting item from database");
        };
      });
    }

    async addUser(user: T): Promise<void> {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.add(user);
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error adding user");
      });
    }

    async getUser(username: string): Promise<T | undefined> {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(username);
  
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
  
        request.onerror = () => reject("Error retrieving user");
      });
    }

    isUserLoggedIn(): boolean {
      return !!localStorage.getItem('loggedInUser');
    }
  
    loginUser(username: string) {
      localStorage.setItem('loggedInUser', username);
    }
  
    logoutUser() {
      localStorage.removeItem('loggedInUser');
    }
  }

