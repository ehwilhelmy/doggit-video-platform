"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileVideo, Users, BarChart3, Eye, Clock, Shield } from "lucide-react"

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
  video_url?: string
  created_at: string
  is_featured: boolean
  view_count: number
}

export default function SimpleAdminPanel() {
  const router = useRouter()
  const [videos] = useState<Video[]>([
    {
      id: "puppy-basics",
      title: "Puppy Basics",
      description: "Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan.",
      instructor: "Jayme Nolan",
      duration: "15:30",
      category: "Puppy Training",
      level: "Beginner",
      thumbnail_url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&h=600&fit=crop",
      video_url: "https://drive.usercontent.google.com/download?id=1Cb0R2HcNtovUx0gSuF_L6KQeoLZZhaDk&export=download",
      created_at: "2024-01-15T10:00:00Z",
      is_featured: true,
      view_count: 1250
    },
    {
      id: "advanced-obedience",
      title: "Advanced Obedience Commands",
      description: "Take your dog's training to the next level with advanced obedience commands and techniques for better control and communication.",
      instructor: "Mike Chen",
      duration: "18:45",
      category: "Obedience",
      level: "Advanced",
      thumbnail_url: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&h=600&fit=crop",
      created_at: "2024-01-10T14:30:00Z",
      is_featured: false,
      view_count: 890
    },
    {
      id: "leash-training",
      title: "Leash Training Techniques",
      description: "Learn effective leash training techniques to make walks enjoyable for both you and your dog. End pulling and create positive walking experiences.",
      instructor: "Emily Rodriguez",
      duration: "15:20",
      category: "Walking",
      level: "Intermediate",
      thumbnail_url: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&h=600&fit=crop",
      created_at: "2024-01-05T09:15:00Z",
      is_featured: false,
      view_count: 675
    }
  ])

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
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
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
                <Button className="gap-2">
                  <FileVideo className="h-4 w-4" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded"
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
                        <span className="text-xs text-gray-500">{video.view_count} views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}