"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Activity,
  Search,
  ChevronLeft,
  UserCheck,
  UserX,
  Loader2,
  ArrowLeft,
  FileVideo,
  BarChart3,
  FileText
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  created_at: string
  first_name?: string
  last_name?: string
  puppy_name?: string
  role: string
  subscription: {
    status: string
    stripe_customer_id?: string
    stripe_subscription_id?: string
    current_period_end?: string
    cancel_at_period_end?: boolean
  } | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      if (authLoading) return

      if (!currentUser) {
        router.push('/dashboard')
        return
      }

      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await fetchUsers()
    }

    checkAdmin()
  }, [currentUser, authLoading, router])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users || [])
      setFilteredUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.puppy_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      canceled: 'bg-red-500/10 text-red-500 border-red-500/20',
      past_due: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      trialing: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }
    return styles[status as keyof typeof styles] || styles.inactive
  }

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (!response.ok) {
        throw new Error('Failed to update role')
      }

      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error toggling admin role:', error)
      alert('Failed to update user role')
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/simple')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-jade-purple rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">DOGGIT Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              User Management
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Link href="/admin/simple" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileVideo className="h-4 w-4" />
                Videos
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2 bg-jade-purple/10 text-jade-purple">
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Link href="/admin/analytics" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/resources" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Resources
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-jade-purple" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.subscription?.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stripe Customers</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.subscription?.stripe_customer_id).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Puppy</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'No name'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {user.puppy_name || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.subscription ? (
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant="outline"
                              className={getStatusBadge(user.subscription.status)}
                            >
                              {user.subscription.status}
                            </Badge>
                            {user.subscription.stripe_customer_id && (
                              <span className="text-xs text-zinc-500">
                                Stripe
                              </span>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className={getStatusBadge('inactive')}>
                            No subscription
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleAdminRole(user.id, user.role)}
                            className={user.role === 'admin' ? 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}
                          >
                            {user.role === 'admin' ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Make Admin
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No users found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  )
}