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
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
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
  async readData(key: string) {
    const dbRef = ref(this.database)
    try {
      const snapshot = await get(child(dbRef, key))
      return snapshot.val()
    } catch (_) {
      return undefined
    }
  }
  observeData<T>(key: string, callback: (data: T) => unknown) {
    const starCountRef = ref(this.database, key)
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val()
      callback(data)
    })
  }
}
