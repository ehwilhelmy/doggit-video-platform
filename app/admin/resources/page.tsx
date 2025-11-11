"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  FileVideo,
  Users,
  BarChart3,
  Shield,
  Loader2,
  Trash2,
  Pencil,
  ExternalLink,
  FileText,
  Calendar,
  Eye,
  EyeOff,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { AddResourceModal } from "@/components/admin/add-resource-modal"
import { EditResourceModal } from "@/components/admin/edit-resource-modal"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Resource {
  id: string
  title: string
  description?: string
  image_url?: string
  url: string
  published_date: string
  tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function AdminResourcesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const fetchResources = async () => {
    try {
      setIsLoadingResources(true)
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch('/api/admin/resources', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }

      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoadingResources(false)
    }
  }

  const deleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return
    }

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete resource')
      }

      await fetchResources()
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Failed to delete resource')
    }
  }

  // Check admin status and fetch resources
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push('/dashboard')
        return
      }

      try {
        const supabase = createClient()
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error || !profile || profile.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        setIsAdmin(true)
        await fetchResources()
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push('/dashboard')
      } finally {
        setIsChecking(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  // Show loading while checking
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
      </div>
    )
  }

  // Don't render anything if not admin (will redirect)
  if (!isAdmin) {
    return null
  }

  const publishedCount = resources.filter(r => r.is_published).length
  const draftCount = resources.filter(r => !r.is_published).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => router.push('/admin/simple')}
              className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-jade-purple rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">DOGGIT Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
              Resources
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-[73px] lg:mt-0 lg:min-h-[calc(100vh-73px)]
        `}>
          <nav className="p-4 space-y-2">
            <Link href="/admin/simple" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileVideo className="h-4 w-4" />
                Videos
              </Button>
            </Link>
            <Link href="/admin/users" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/analytics" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 bg-jade-purple/10 text-jade-purple"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Resources
            </Button>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-[73px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6 w-full min-w-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-jade-purple" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Resources</p>
                    <p className="text-2xl font-bold">{resources.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                    <p className="text-2xl font-bold">{publishedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <EyeOff className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
                    <p className="text-2xl font-bold">{draftCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resources List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Resources Library</CardTitle>
                <Button className="gap-2 bg-jade-purple hover:bg-jade-purple/90 w-full sm:w-auto" onClick={() => setShowAddModal(true)}>
                  <FileText className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingResources ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-jade-purple animate-spin" />
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No resources yet. Click "Add Resource" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {resource.image_url && (
                        <img
                          src={resource.image_url}
                          alt={resource.title}
                          className="w-full sm:w-32 h-40 sm:h-20 object-cover rounded"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                              {!resource.is_published && (
                                <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            {resource.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(resource.published_date).toLocaleDateString()}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-jade-purple hover:text-jade-purple/80 flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Article
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingResource(resource)
                            setShowEditModal(true)
                          }}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResource(resource.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchResources}
      />

      {/* Edit Resource Modal */}
      <EditResourceModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={fetchResources}
        resource={editingResource}
      />
    </div>
  )
}
