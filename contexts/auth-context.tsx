"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any, error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<{ error: any | null }>
  signOut: () => Promise<{ error: any | null }>
  isSubscribed: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session from Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Check subscription status
      if (session?.user) {
        checkSubscriptionStatus(session.user.id)
      }
      
      // Also check localStorage for backwards compatibility
      const storedUser = localStorage.getItem('user')
      if (!session && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.isAuthenticated) {
            // Migrate to Supabase auth if needed
            console.log('Found legacy auth data, consider migrating to Supabase')
          }
        } catch (error) {
          console.error('Error parsing stored user:', error)
        }
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        checkSubscriptionStatus(session.user.id)
      } else {
        setIsSubscribed(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSubscriptionStatus = async (userId: string) => {
    // Check if user has active subscription in database
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()
      
      if (!error && data) {
        setIsSubscribed(true)
      } else {
        // Fallback to localStorage for demo
        const paymentCompleted = localStorage.getItem('paymentCompleted')
        setIsSubscribed(paymentCompleted === 'true')
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const signUp = async (email: string, password: string, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    
    if (!error && data.user) {
      // Also store in localStorage for backwards compatibility
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        ...metadata, 
        isAuthenticated: true,
        id: data.user.id 
      }))
    }
    
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error && data.user) {
      // Also store in localStorage for backwards compatibility
      localStorage.setItem('user', JSON.stringify({ 
        email: data.user.email, 
        isAuthenticated: true,
        id: data.user.id
      }))
    }
    
    return { error }
  }

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: provider === 'google' ? {
          access_type: 'offline',
          prompt: 'consent',
        } : undefined,
      },
    })
    
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
      setIsSubscribed(false)
      localStorage.removeItem('user')
      localStorage.removeItem('paymentCompleted')
      localStorage.removeItem('subscriptionActive')
      router.push('/')
    }
    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      isSubscribed
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