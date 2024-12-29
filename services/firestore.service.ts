// services/firestore.service.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  WhereFilterOp,
  DocumentData,
  QuerySnapshot,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CollectionName, FirestoreDocument } from '../types/firebase';

export class FirestoreService {
  /**
   * Create a new document in the specified collection
   */
  static async createDocument<T extends DocumentData>(
    collectionName: CollectionName,
    data: T
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   */
  static async getDocuments<T>(
    collectionName: CollectionName
  ): Promise<FirestoreDocument<T>[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return this.processQuerySnapshot<T>(querySnapshot);
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  /**
   * Update a document in the specified collection
   */
  static async updateDocument<T extends DocumentData>(
    collectionName: CollectionName,
    docId: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete a document from the specified collection
   */
  static async deleteDocument(
    collectionName: CollectionName,
    docId: string
  ): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Query documents with specific conditions
   */
  static async queryDocuments<T>(
    collectionName: CollectionName,
    field: string,
    operator: WhereFilterOp,
    value: any
  ): Promise<FirestoreDocument<T>[]> {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, operator, value)
      );
      const querySnapshot = await getDocs(q);
      return this.processQuerySnapshot<T>(querySnapshot);
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  /**
   * Process query snapshot into typed array
   */
  private static processQuerySnapshot<T>(
    querySnapshot: QuerySnapshot
  ): FirestoreDocument<T>[] {
    const documents: FirestoreDocument<T>[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        ...(doc.data() as T),
        id: doc.id,
      });
    });
    return documents;
  }
}