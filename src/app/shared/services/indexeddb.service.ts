import { Injectable } from '@angular/core';
import { DBEnum } from '../models/db.enum';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db!: IDBDatabase;

  constructor() {}

  public initDB() {
    const request = indexedDB.open(DBEnum.GENERAL_DB, 1);
    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(DBEnum.RANKING_STORE)) {
        this.db.createObjectStore(DBEnum.RANKING_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!this.db.objectStoreNames.contains(DBEnum.HISTORY_STORE)) {
        this.db.createObjectStore(DBEnum.HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      console.log('Database initialized successfully');
    };
    request.onerror = event => {
      console.error('Error initializing database:', (event.target as IDBOpenDBRequest).error);
    };
  }

  public addData(storeName: string, data: any): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  public getAllData(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public updateData(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public deleteData(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
