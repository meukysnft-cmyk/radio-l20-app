import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { FirestoreCollectionName } from '../types/content'

type CollectionPath = FirestoreCollectionName | (string & {})

export type FirestoreRecord<T> = T & {
  id: string
}

const DEFAULT_LIST_LIMIT = 200

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido.'
}

function wrapFirestoreError(action: string, error: unknown): never {
  console.error(action, error)
  throw new Error(`${action} ${getErrorMessage(error)}`)
}

export async function listDocuments<T extends DocumentData>(
  collectionName: CollectionPath,
  maxResults: number = DEFAULT_LIST_LIMIT,
): Promise<Array<FirestoreRecord<T>>> {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'),
      firestoreLimit(maxResults),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...(documentSnapshot.data() as T),
    }))
  } catch (error) {
    wrapFirestoreError('Não foi possível listar os documentos.', error)
  }
}

export function subscribeDocuments<T extends DocumentData>(
  collectionName: CollectionPath,
  onChange: (documents: Array<FirestoreRecord<T>>) => void,
  onError?: (error: unknown) => void,
) {
  const q = query(
    collection(db, collectionName),
    orderBy('createdAt', 'desc'),
    firestoreLimit(DEFAULT_LIST_LIMIT),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      onChange(
        snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...(documentSnapshot.data() as T),
        })),
      )
    },
    (error) => {
      if (onError) {
        onError(error)
        return
      }

      wrapFirestoreError('Não foi possível ouvir os documentos.', error)
    },
  )
}

export async function getDocument<T extends DocumentData>(
  collectionName: CollectionPath,
  id: string,
): Promise<FirestoreRecord<T> | null> {
  try {
    const documentRef = doc(db, collectionName, id)
    const snapshot = await getDoc(documentRef)

    if (!snapshot.exists()) {
      return null
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as T),
    }
  } catch (error) {
    wrapFirestoreError('Não foi possível carregar o documento.', error)
  }
}

export async function createDocument<T extends Record<string, unknown>>(
  collectionName: CollectionPath,
  data: T,
) {
  try {
    const documentRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return documentRef.id
  } catch (error) {
    wrapFirestoreError('Não foi possível criar o documento.', error)
  }
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: CollectionPath,
  id: string,
  data: T,
) {
  try {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    wrapFirestoreError('Não foi possível atualizar o documento.', error)
  }
}

export async function deleteDocument(collectionName: CollectionPath, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id))
  } catch (error) {
    wrapFirestoreError('Não foi possível excluir o documento.', error)
  }
}

export async function setDocument<T extends Record<string, unknown>>(
  collectionName: CollectionPath,
  id: string,
  data: T,
) {
  try {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    wrapFirestoreError('Não foi possível salvar o documento.', error)
  }
}
