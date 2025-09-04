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
  resetPassword: (email: string) => Promise<{ error: any | null }>
  isSubscribed: boolean
  subscriptionLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session from Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Initial session:', session)
      console.log('Initial user:', session?.user)
      console.log('Initial user email:', session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      // Check subscription status
      if (session?.user) {
        checkSubscriptionStatus(session.user.id)
      } else {
        setSubscriptionLoading(false)
      }
      
      // Clear any legacy localStorage auth data if we have a real Supabase session
      if (session?.user) {
        // Clear old localStorage auth data
        localStorage.removeItem('user')
        localStorage.removeItem('accountData')
        localStorage.removeItem('isAuthenticated')
        console.log('Cleared legacy auth data, using Supabase session')
      } else {
        // Only check localStorage if no Supabase session exists
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            if (userData.isAuthenticated) {
              console.log('Found legacy auth data, but no Supabase session - clearing legacy data')
              localStorage.removeItem('user')
              localStorage.removeItem('accountData') 
              localStorage.removeItem('isAuthenticated')
            }
          } catch (error) {
            console.error('Error parsing stored user:', error)
          }
        }
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state change:', _event)
      console.log('Session user:', session?.user)
      console.log('User email from session:', session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        checkSubscriptionStatus(session.user.id)
      } else {
        setIsSubscribed(false)
        setSubscriptionLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSubscriptionStatus = async (userId: string) => {
    // Check if user has active subscription in database
    setSubscriptionLoading(true)
    try {
      // First check if this is an admin account or known user - grant immediate access
      const currentUser = await supabase.auth.getUser()
      console.log('Auth: Checking subscription for user:', currentUser.data.user?.email)
      
      // Admin accounts
      if (currentUser.data.user?.email === 'erica@doggit.app' || currentUser.data.user?.email === 'thor@doggit.app') {
        console.log('Auth: Admin account detected, granting access')
        setIsSubscribed(true)
        setSubscriptionLoading(false)
        return
      }
      
      // Temporary fix: Grant access to known users while RLS issue is being resolved
      const knownUsers = [
        'herohomesolutionswa@gmail.com',
        'carleyjsimpson@gmail.com', 
        'josimpson55@gmail.com',
        'collinbutkus95@gmail.com',
        'cameron@doggit.app',
        'cameron.simpson99@gmail.com'
      ]
      if (knownUsers.includes(currentUser.data.user?.email || '')) {
        console.log('Auth: Known user detected, granting access (temporary fix)')
        setIsSubscribed(true)
        setSubscriptionLoading(false)
        return
      }
      
      // Demo account - allow in both development and production for now
      if (currentUser.data.user?.email === 'demo@doggit.app') {
        console.log('Auth: Demo account detected, granting access')
        setIsSubscribed(true)
        setSubscriptionLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()
      
      console.log('Auth: Subscription query result:', { data, error, userId })
      
      if (!error && data) {
        console.log('Auth: Active subscription found in database')
        setIsSubscribed(true)
      } else {
        console.log('Auth: No active subscription found in database, checking localStorage fallback')
        // Fallback to localStorage for demo/testing
        const paymentCompleted = localStorage.getItem('paymentCompleted')
        const hasPayment = paymentCompleted === 'true'
        console.log('Auth: localStorage paymentCompleted:', hasPayment)
        
        // Set subscription status based on payment status
        setIsSubscribed(hasPayment)
      }
      setSubscriptionLoading(false)
    } catch (error) {
      console.error('Error checking subscription:', error)
      // For admin accounts, grant access (fallback)
      const currentUser = await supabase.auth.getUser()
      if (currentUser.data.user?.email === 'erica@doggit.app' || currentUser.data.user?.email === 'thor@doggit.app') {
        setIsSubscribed(true)
      } else {
        // Fallback to localStorage for other users
        const paymentCompleted = localStorage.getItem('paymentCompleted')
        setIsSubscribed(paymentCompleted === 'true')
      }
      setSubscriptionLoading(false)
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

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`
    })
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
      resetPassword,
      isSubscribed,
      subscriptionLoading
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