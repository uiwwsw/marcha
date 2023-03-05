import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  child,
  Database,
  get,
  getDatabase,
  onValue,
  ref,
  set,
} from 'firebase/database'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import { injectable } from 'inversify'
import 'reflect-metadata'





const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
}
export const FirebaseSerSym = Symbol.for('FirebaseSerSym')
@injectable()
export class FirebaseService {
  public app: FirebaseApp
  database: Database
  storage: FirebaseStorage
  constructor() {
    this.app = initializeApp(firebaseConfig)
    this.database = getDatabase()
    this.storage = getStorage(this.app)
  }
  async writeData<T>(key: string, data: T) {
    await set(ref(this.database, key), data)
  }
  async readData<T>(key: string) {
    const dbRef = ref(this.database)
    try {
      const snapshot = await get(child(dbRef, key))
      return snapshot.val() as T
    } catch (_) {
      return undefined
    }
  }
  observeData<T>(key: string, callback: (data: T) => unknown) {
    const starCountRef = ref(this.database, key)
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val() as T
      callback(data)
    })
  }
}
