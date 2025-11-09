"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileVideo, Users, BarChart3, Eye, Clock, Shield, Loader2, Trash2, Pencil } from "lucide-react"
import { AddVideoModal } from "@/components/admin/add-video-modal"
import { EditVideoModal } from "@/components/admin/edit-video-modal"
import { VideoThumbnailPreview } from "@/components/admin/video-thumbnail-preview"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Video {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  category: string
  level: string
  thumbnail_url?: string
  vimeo_id?: string
  created_at: string
  is_featured: boolean
  view_count: number
}

export default function SimpleAdminPanel() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  const fetchVideos = async () => {
    try {
      setIsLoadingVideos(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching videos:', error)
        return
      }

      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoadingVideos(false)
    }
  }

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)

      if (error) throw error

      await fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete video')
    }
  }

  // Check admin status and fetch videos
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
          // Not an admin, redirect to dashboard
          router.push('/dashboard')
          return
        }

        setIsAdmin(true)
        // Fetch videos after confirming admin status
        await fetchVideos()
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
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Don't render anything if not admin (will redirect)
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
              onClick={() => router.push('/dashboard')}
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
              Admin Panel
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-jade-purple/10 text-jade-purple">
              <FileVideo className="h-4 w-4" />
              Videos
            </Button>
            <Link href="/admin/users" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/analytics" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
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
                  <FileVideo className="h-8 w-8 text-jade-purple" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                    <p className="text-2xl font-bold">{videos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-2xl font-bold">{videos.reduce((sum, v) => sum + v.view_count, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Featured Videos</p>
                    <p className="text-2xl font-bold">{videos.filter(v => v.is_featured).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructors</p>
                    <p className="text-2xl font-bold">{new Set(videos.map(v => v.instructor)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Videos Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Video Library</CardTitle>
                <Button className="gap-2 bg-jade-purple hover:bg-jade-purple/90" onClick={() => setShowAddModal(true)}>
                  <FileVideo className="h-4 w-4" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingVideos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-jade-purple animate-spin" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileVideo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No videos yet. Click "Add Video" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <VideoThumbnailPreview
                        thumbnailUrl={video.thumbnail_url}
                        vimeoId={video.vimeo_id}
                        title={video.title}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{video.title}</h3>
                          {video.is_featured && <Badge variant="secondary">Featured</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{video.instructor} • {video.duration}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{video.category}</Badge>
                          <Badge variant="outline">{video.level}</Badge>
                          {video.vimeo_id && (
                            <span className="text-xs text-gray-500">Vimeo: {video.vimeo_id}</span>
                          )}
                          <span className="text-xs text-gray-500">{video.view_count || 0} views</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingVideo(video)
                            setShowEditModal(true)
                          }}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVideo(video.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Add Video Modal */}
      <AddVideoModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchVideos}
      />

      {/* Edit Video Modal */}
      <EditVideoModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={fetchVideos}
        video={editingVideo}
      />
    </div>
  )
}