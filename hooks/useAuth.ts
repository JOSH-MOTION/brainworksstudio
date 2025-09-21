'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'
import { toast } from 'sonner'

interface UseAuthReturn {
  user: User | null
  firebaseUser: FirebaseUser | null
  userProfile: User | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userData: Partial<User>) => Promise<void>
  isAdmin: boolean
}

// Create Auth Context
const AuthContext = createContext<UseAuthReturn | undefined>(undefined)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthInternal()
  return React.createElement(AuthContext.Provider, { value: auth }, children)
}

// Custom hook to use auth context
export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Internal auth logic
function useAuthInternal(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase is not initialized, set loading to false and return
    if (!auth) {
      console.warn('Firebase Auth not initialized. Authentication features disabled.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser)
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              ...userData,
              createdAt: userData.createdAt?.toDate(),
            } as User)
          } else {
            // Create user document if it doesn't exist
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              role: 'user',
              createdAt: new Date(),
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            setUser(newUser)
          }
        } else {
          setUser(null)
          setFirebaseUser(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        toast.error('Authentication error occurred')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      if (userData.displayName) {
        await updateProfile(firebaseUser, { displayName: userData.displayName })
      }

      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: userData.displayName || '',
        phone: userData.phone,
        address: userData.address,
        location: userData.location,
        profileImageUrl: userData.profileImageUrl,
        role: userData.role || 'user',
        createdAt: new Date(),
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth not initialized. Please check your configuration.');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Signed in successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  }

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth not initialized. Please check your configuration.');
    }

    try {
      await firebaseSignOut(auth)
      toast.success('Signed out successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!db) {
      throw new Error('Firebase Firestore not initialized. Please check your configuration.');
    }

    if (!user) {
      toast.error('No user logged in to update profile');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), userData)
      setUser({ ...user, ...userData })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  }

  return {
    user,
    firebaseUser,
    userProfile: user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    isAdmin: user?.role === 'admin',
  }
}