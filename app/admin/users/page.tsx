"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  UserX
} from "lucide-react"
import Link from "next/link"

// Mock user data for demo
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    created_at: '2024-01-15',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    subscription_status: 'active',
    total_videos_watched: 15
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    created_at: '2024-02-20',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    subscription_status: 'trial',
    total_videos_watched: 3
  }
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [isLoading, setIsLoading] = useState(false)

  // Check admin access
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/auth')
    }
  }, [router])

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      trial: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }
    return styles[status as keyof typeof styles] || styles.inactive
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-black border-b border-zinc-800">
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
          <Link href="/admin/simple">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-white">User Management</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-zinc-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.subscription_status === 'active').length}
              </div>
              <p className="text-xs text-zinc-400">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Trial Users</CardTitle>
              <Activity className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.subscription_status === 'trial').length}
              </div>
              <p className="text-xs text-zinc-400">In trial period</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Avg. Videos Watched</CardTitle>
              <Activity className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Math.round(users.reduce((acc, u) => acc + (u.total_videos_watched || 0), 0) / users.length)}
              </div>
              <p className="text-xs text-zinc-400">Per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">All Users</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Videos Watched</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-700/50 hover:bg-zinc-700/30">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-zinc-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={getStatusBadge(user.subscription_status)}
                        >
                          {user.subscription_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {user.total_videos_watched}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  No users found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}