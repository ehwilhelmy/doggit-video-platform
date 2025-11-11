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
  Eye,
  TrendingUp,
  Activity,
  Loader2,
  FileText,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Video {
  id: string
  title: string
  view_count: number
  category: string
}

interface AnalyticsData {
  totalVideos: number
  totalUsers: number
  totalViews: number
  activeSubscribers: number
  averageViewsPerVideo: number
  topVideos: Video[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true)
      const supabase = createClient()

      // Fetch videos with view counts
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('id, title, view_count, category')
        .order('view_count', { ascending: false })

      if (videosError) {
        console.error('Error fetching videos:', videosError)
        return
      }

      // Fetch users count
      const { data: { session } } = await supabase.auth.getSession()
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const usersData = await usersResponse.json()
      const users = usersData.users || []

      const totalVideos = videos?.length || 0
      const totalUsers = users.length
      const totalViews = videos?.reduce((sum, v) => sum + (v.view_count || 0), 0) || 0
      const activeSubscribers = users.filter((u: any) => u.subscription?.status === 'active').length
      const averageViewsPerVideo = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0
      const topVideos = videos?.slice(0, 5) || []

      setAnalytics({
        totalVideos,
        totalUsers,
        totalViews,
        activeSubscribers,
        averageViewsPerVideo,
        topVideos
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  // Check admin status
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
        await fetchAnalytics()
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
              Analytics
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
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 bg-jade-purple/10 text-jade-purple"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Link href="/admin/resources" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Resources
              </Button>
            </Link>
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
          {isLoadingAnalytics || !analytics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-jade-purple animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <FileVideo className="h-8 w-8 text-jade-purple" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                          <p className="text-2xl font-bold">{analytics.totalVideos}</p>
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
                          <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Views/Video</p>
                          <p className="text-2xl font-bold">{analytics.averageViewsPerVideo}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</p>
                          <p className="text-2xl font-bold">{analytics.activeSubscribers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Watched Videos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Most Watched Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topVideos.map((video, index) => (
                        <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-jade-purple rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{video.title}</p>
                              <Badge variant="outline" className="mt-1">{video.category}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-jade-purple">{video.view_count || 0}</p>
                            <p className="text-xs text-gray-500">views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* User Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Subscription Rate */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Rate</span>
                          <span className="text-sm font-bold text-jade-purple">
                            {analytics.totalUsers > 0
                              ? Math.round((analytics.activeSubscribers / analytics.totalUsers) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-jade-purple h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${analytics.totalUsers > 0
                                ? (analytics.activeSubscribers / analytics.totalUsers) * 100
                                : 0}%`
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{analytics.activeSubscribers} active</span>
                          <span className="text-xs text-gray-500">{analytics.totalUsers} total users</span>
                        </div>
                      </div>

                      {/* Views per User */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Views per User</span>
                          <span className="text-sm font-bold text-blue-500">
                            {analytics.totalUsers > 0
                              ? (analytics.totalViews / analytics.totalUsers).toFixed(1)
                              : 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Total of {analytics.totalViews.toLocaleString()} views across {analytics.totalUsers} users
                        </p>
                      </div>

                      {/* Engagement Score */}
                      <div className="p-4 bg-gradient-to-r from-jade-purple/10 to-queen-purple/10 rounded-lg border border-jade-purple/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Score</p>
                            <p className="text-xs text-gray-500 mt-1">Based on views and subscriptions</p>
                          </div>
                          <div className="text-3xl font-bold text-jade-purple">
                            {Math.min(100, Math.round((analytics.totalViews / Math.max(analytics.totalVideos * analytics.totalUsers, 1)) * 100))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
