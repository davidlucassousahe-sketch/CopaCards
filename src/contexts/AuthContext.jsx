import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // try to load current user from supabase auth (non-blocking)
    const session = supabase.auth.getSession?.()
    if (session && session.data?.session?.user) {
      setUser(session.data.session.user)
    }
    // subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user || null
      setUser(u)
    })
    return () => listener?.subscription?.unsubscribe?.()
  }, [])

  const signIn = async ({ email, password }) => {
    // prefer supabase auth if available, otherwise fake success
    if (supabase.auth.signInWithPassword) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
      return data
    }
    // fallback: mock
    setUser({ id: 'anon', email })
    setProfile({ username: email.split('@')[0], full_name: '' })
    return { user: { id: 'anon', email } }
  }

  const signUp = async ({ email, password, username, full_name }) => {
    if (supabase.auth.signUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setUser(data.user)
      return data
    }
    setUser({ id: 'anon', email })
    setProfile({ username: username || email.split('@')[0], full_name: full_name || '' })
    return { user: { id: 'anon', email } }
  }

  const signOut = async () => {
    if (supabase.auth.signOut) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
