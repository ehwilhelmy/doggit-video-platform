"use client"

import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  user: any | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any, error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<{ error: any | null }>
  signOut: () => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const signUp = async (email: string, password: string, metadata = {}) => {
    // Mock signup for demo
    setUser({ email, ...metadata })
    localStorage.setItem('user', JSON.stringify({ email, ...metadata, isAuthenticated: true }))
    return { data: { email, ...metadata }, error: null }
  }

  const signIn = async (email: string, password: string) => {
    // Mock signin for demo
    setUser({ email })
    localStorage.setItem('user', JSON.stringify({ email, isAuthenticated: true }))
    return { error: null }
  }

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    // Mock social signin for demo
    const mockEmail = `user@${provider}.com`
    setUser({ email: mockEmail })
    localStorage.setItem('user', JSON.stringify({ email: mockEmail, isAuthenticated: true }))
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('user')
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signInWithProvider,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}