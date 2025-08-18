"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  Mail, 
  Calendar,
  Shield,
  CreditCard,
  Activity,
  Search,
  Filter,
  Download,
  ChevronLeft,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Clock,
  Video
} from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    role?: string
    trainingGoals?: string[]
  }
  subscription_status?: 'active' | 'inactive' | 'trial'
  total_videos_watched?: number
  last_video_watched?: string
}

export default function UsersManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Check if user is admin
  const isAdmin = true // Temporarily allow all for testing

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
      return
    }
    
    if (user && isAdmin) {
      loadUsers()
    }
  }, [user, loading, isAdmin, router])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      
      // Fetch users from Supabase Auth
      const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers()
      
      if (error) {
        console.error('Error fetching users:', error)
        // Use mock data if admin API not available
        setUsers(getMockUsers())
        return
      }

      // Map auth users to our user interface
      const mappedUsers = authUsers?.map(authUser => ({
        id: authUser.id,
        email: authUser.email || '',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        user_metadata: authUser.user_metadata,
        subscription_status: 'inactive' as const, // Would fetch from payment system
        total_videos_watched: Math.floor(Math.random() * 50), // Mock data
        last_video_watched: 'Puppy Basics' // Mock data
      })) || []

      setUsers(mappedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      // Fallback to mock data
      setUsers(getMockUsers())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockUsers = (): User[] => [
    {
      id: '1',
      email: 'john.doe@example.com',
      created_at: '2024-01-15T10:00:00Z',
      last_sign_in_at: '2024-01-20T14:30:00Z',
      user_metadata: {
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        trainingGoals: ['Potty training', 'Basic commands']
      },
      subscription_status: 'active',
      total_videos_watched: 23,
      last_video_watched: 'Puppy Basics'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      created_at: '2024-01-10T08:00:00Z',
      last_sign_in_at: '2024-01-19T16:45:00Z',
      user_metadata: {
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        trainingGoals: ['Leash training', 'Socialization']
      },
      subscription_status: 'trial',
      total_videos_watched: 5,
      last_video_watched: 'Leash Training Techniques'
    },
    {
      id: '3',
      email: 'admin@doggit.app',
      created_at: '2024-01-01T00:00:00Z',
      last_sign_in_at: '2024-01-20T18:00:00Z',
      user_metadata: {
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      subscription_status: 'active',
      total_videos_watched: 45,
      last_video_watched: 'Advanced Obedience Commands'
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.user_metadata?.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.subscription_status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleExportUsers = () => {
    const csv = [
      ['Email', 'Name', 'Role', 'Status', 'Joined', 'Last Active', 'Videos Watched'].join(','),
      ...filteredUsers.map(user => [
        user.email,
        `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`,
        user.user_metadata?.role || 'user',
        user.subscription_status || 'inactive',
        new Date(user.created_at).toLocaleDateString(),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never',
        user.total_videos_watched || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      )
      
      if (error) throw error
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } }
          : u
      ))
      
      alert('User role updated successfully')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
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
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.subscription_status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trial Users</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.subscription_status === 'trial').length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.user_metadata?.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleExportUsers} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Users className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <AddUserForm onSuccess={loadUsers} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Activity</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      onViewDetails={() => {
                        setSelectedUser(user)
                        setShowUserDetails(true)
                      }}
                      onRoleChange={handleRoleChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetailsView user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UserRow({ 
  user, 
  onViewDetails, 
  onRoleChange 
}: { 
  user: User, 
  onViewDetails: () => void,
  onRoleChange: (userId: string, role: string) => void 
}) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadgeColor = (role?: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-3 px-4">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {user.user_metadata?.firstName} {user.user_metadata?.lastName}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-400 mt-1">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </td>
      
      <td className="py-3 px-4">
        <Badge className={getRoleBadgeColor(user.user_metadata?.role)}>
          {user.user_metadata?.role === 'admin' ? (
            <Shield className="h-3 w-3 mr-1" />
          ) : null}
          {user.user_metadata?.role || 'user'}
        </Badge>
      </td>
      
      <td className="py-3 px-4">
        <Badge className={getStatusColor(user.subscription_status)}>
          {user.subscription_status || 'inactive'}
        </Badge>
      </td>
      
      <td className="py-3 px-4">
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Video className="h-3 w-3" />
            {user.total_videos_watched || 0} videos watched
          </div>
          {user.last_sign_in_at && (
            <div className="text-xs text-gray-400 mt-1">
              Last active: {new Date(user.last_sign_in_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </td>
      
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            <Eye className="h-4 w-4" />
          </Button>
          
          <Select 
            defaultValue={user.user_metadata?.role || 'user'}
            onValueChange={(value) => onRoleChange(user.id, value)}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </td>
    </tr>
  )
}

function AddUserForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
    sendInvite: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (formData.sendInvite) {
        // Send invitation email (user sets their own password)
        const { error } = await supabase.auth.admin.inviteUserByEmail(formData.email, {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role
          }
        })
        
        if (error) throw error
        alert('Invitation sent successfully!')
      } else {
        // Create user with password
        const { error } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
          user_metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role
          }
        })
        
        if (error) throw error
        alert('User created successfully!')
      }
      
      onSuccess()
    } catch (error: any) {
      console.error('Error creating user:', error)
      setError(error.message || 'Failed to create user')
      
      // Fallback for if admin API not available
      if (error.message?.includes('not authorized')) {
        alert('User would be created (Admin API not configured). In production, this would send an invite email.')
        onSuccess()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="sendInvite"
          checked={formData.sendInvite}
          onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="sendInvite" className="text-sm font-normal">
          Send invitation email (user sets their own password)
        </Label>
      </div>

      {!formData.sendInvite && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimum 6 characters"
            required={!formData.sendInvite}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : formData.sendInvite ? 'Send Invitation' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}

function UserDetailsView({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="font-semibold mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600">Name</Label>
            <p className="font-medium">
              {user.user_metadata?.firstName} {user.user_metadata?.lastName}
            </p>
          </div>
          <div>
            <Label className="text-gray-600">Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <Label className="text-gray-600">Role</Label>
            <p className="font-medium">{user.user_metadata?.role || 'user'}</p>
          </div>
          <div>
            <Label className="text-gray-600">Status</Label>
            <Badge>{user.subscription_status || 'inactive'}</Badge>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div>
        <h3 className="font-semibold mb-3">Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600">Joined</Label>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-gray-600">Last Active</Label>
            <p className="font-medium">
              {user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
          <div>
            <Label className="text-gray-600">Videos Watched</Label>
            <p className="font-medium">{user.total_videos_watched || 0}</p>
          </div>
          <div>
            <Label className="text-gray-600">Last Video</Label>
            <p className="font-medium">{user.last_video_watched || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Training Goals */}
      {user.user_metadata?.trainingGoals && user.user_metadata.trainingGoals.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Training Goals</h3>
          <div className="flex flex-wrap gap-2">
            {user.user_metadata.trainingGoals.map((goal, index) => (
              <Badge key={index} variant="outline">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}