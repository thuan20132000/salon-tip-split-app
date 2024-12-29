// types/firebase.ts
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface UserDocument {
  id?: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoDocument {
  id?: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}



// Generic type for Firestore document
export type FirestoreDocument<T> = T & {
  id: string;
};

export type CollectionName = 'users' | 'todos' | 'staffs' | 'products' | 'orders' | 'payments';
