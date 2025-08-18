"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  Play,
  Plus,
  Download,
  Share2,
  ThumbsUp,
  Clock,
  Calendar,
  Users,
  Star,
  CheckCircle,
  Lock,
  PlayCircle
} from "lucide-react"

// Mock data for the video
const videoData = {
  id: "1",
  title: "Advanced Agility Training: Complete Masterclass",
  description: "Transform your dog into an agility champion with professional training techniques. Learn obstacle navigation, speed training, and competition preparation from world-class trainers.",
  thumbnailUrl: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=1920",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  instructor: {
    name: "Sarah Johnson",
    title: "Certified Dog Trainer & Agility Champion",
    avatar: "SJ",
    students: "15.2k",
    courses: 12
  },
  duration: "8h 45m",
  lessons: 42,
  level: "Advanced",
  rating: 4.8,
  reviews: 2341,
  enrolled: 8432,
  lastUpdated: "December 2024",
  language: "English",
  certificate: true,
  isPremium: true,
  price: "$9.99/mo"
}

const curriculum = [
  {
    section: "Foundation & Warm-Up Exercises",
    duration: "1h 20m",
    lessons: [
      { title: "Course Introduction & Safety", duration: "5:32", isPreview: true, completed: true },
      { title: "Essential Equipment Setup", duration: "12:45", completed: true },
      { title: "Building Your Dog's Confidence", duration: "18:20", completed: false },
      { title: "Basic Conditioning Exercises", duration: "15:10", completed: false }
    ]
  },
  {
    section: "Obstacle Training Techniques",
    duration: "2h 15m",
    lessons: [
      { title: "Jump Training Fundamentals", duration: "22:15", completed: false },
      { title: "Tunnel Work & Speed Building", duration: "18:30", completed: false },
      { title: "Weave Poles Mastery", duration: "25:40", completed: false },
      { title: "A-Frame & Dog Walk Training", duration: "20:12", completed: false }
    ]
  },
  {
    section: "Competition Preparation",
    duration: "1h 45m",
    lessons: [
      { title: "Course Sequencing Strategies", duration: "15:20", completed: false },
      { title: "Handler Communication & Cues", duration: "18:45", completed: false },
      { title: "Competition Day Preparation", duration: "22:10", completed: false },
      { title: "Troubleshooting Common Issues", duration: "16:30", completed: false }
    ]
  }
]

const relatedVideos = [
  {
    id: "2",
    title: "Puppy Training Basics",
    thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    duration: "4h 20m",
    instructor: "Mike Chen"
  },
  {
    id: "3",
    title: "Dog Behavior & Psychology",
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    duration: "6h 15m",
    instructor: "Emma Wilson"
  },
  {
    id: "4",
    title: "Professional Dog Grooming",
    thumbnail: "https://images.unsplash.com/photo-1558788353-03f39e5e3c6e?w=400",
    duration: "5h 30m",
    instructor: "David Park"
  }
]

export default function VideoDetailsPage() {
  const router = useRouter()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [expandedSection, setExpandedSection] = useState<number | null>(0)

  const handleEnroll = () => {
    if (!isSubscribed) {
      console.log("Redirecting to subscription...")
      setIsSubscribed(true)
    } else {
      console.log("Starting course...")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-900 hover:text-jade-purple"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden md:inline">Back to Browse</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Share2 className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-jade-purple to-queen-purple text-white">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[40vh] w-full md:h-[50vh]">
          <img
            src={videoData.thumbnailUrl}
            alt={videoData.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all hover:bg-white/30">
              <Play className="ml-1 h-8 w-8 text-white" />
            </button>
          </div>
        </div>

        {/* Course Info */}
        <div className="container px-4 py-8 md:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-queen-purple text-white">
                  {videoData.level}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {videoData.lessons} Lessons
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  <Clock className="mr-1 h-3 w-3" />
                  {videoData.duration}
                </Badge>
                {videoData.certificate && (
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Certificate
                  </Badge>
                )}
              </div>

              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {videoData.title}
              </h1>

              <p className="mb-6 text-gray-600">
                {videoData.description}
              </p>

              {/* Instructor */}
              <div className="mb-8 flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-jade-purple to-queen-purple text-white">
                    {videoData.instructor.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-white">{videoData.instructor.name}</p>
                  <p className="text-sm text-gray-400">{videoData.instructor.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{videoData.instructor.students} students</p>
                  <p className="text-sm text-gray-400">{videoData.instructor.courses} courses</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  <div className="space-y-4">
                    {curriculum.map((section, idx) => (
                      <Card key={idx} className="border-gray-800 bg-gray-900/50">
                        <button
                          onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <div>
                            <h3 className="font-semibold text-white">{section.section}</h3>
                            <p className="text-sm text-gray-400">
                              {section.lessons.length} lessons • {section.duration}
                            </p>
                          </div>
                          <PlayCircle className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {expandedSection === idx && (
                          <div className="border-t border-gray-800 px-4 pb-4">
                            {section.lessons.map((lesson, lessonIdx) => (
                              <div
                                key={lessonIdx}
                                className="flex items-center justify-between py-3 hover:bg-gray-800/50"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : lesson.isPreview ? (
                                    <Play className="h-4 w-4 text-queen-purple" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-gray-600" />
                                  )}
                                  <span className="text-sm text-gray-300">{lesson.title}</span>
                                  {lesson.isPreview && (
                                    <Badge variant="outline" className="h-5 border-queen-purple text-queen-purple">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6 text-gray-300">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">What you&apos;ll learn</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 text-green-500" />
                          <span>Train your dog for professional agility competitions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 text-green-500" />
                          <span>Master all standard agility obstacles and sequences</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 text-green-500" />
                          <span>Build speed, accuracy, and confidence in your dog</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 text-green-500" />
                          <span>Develop effective handler communication techniques</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Requirements</h3>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        <li>Dog should know basic commands (sit, stay, come)</li>
                        <li>Dog should be at least 12 months old</li>
                        <li>Access to agility equipment or space to set up</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(videoData.rating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white">{videoData.rating}</span>
                      <span className="text-gray-400">({videoData.reviews} reviews)</span>
                    </div>
                    
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-gray-800 bg-gray-900/50 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-white">User {i}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            Excellent course! The instructor explains complex concepts clearly.
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-6 text-center">
                  {videoData.isPremium && !isSubscribed ? (
                    <>
                      <p className="mb-2 text-3xl font-bold text-white">{videoData.price}</p>
                      <p className="text-sm text-gray-400">Unlimited access to all content</p>
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-green-400">Full Access</p>
                  )}
                </div>

                <Button
                  onClick={handleEnroll}
                  className="mb-4 w-full"
                  size="lg"
                >
                  {!isSubscribed ? "Subscribe to Access" : "Continue Learning"}
                </Button>

                <Button variant="outline" className="mb-6 w-full border-gray-600 bg-white text-black hover:bg-gray-100">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to List
                </Button>

                <div className="space-y-3 border-t border-gray-800 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{videoData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Lessons</span>
                    <span className="text-white">{videoData.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Level</span>
                    <span className="text-white">{videoData.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Language</span>
                    <span className="text-white">{videoData.language}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white">{videoData.lastUpdated}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-800 pt-6">
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Download className="mr-2 h-4 w-4" />
                    Resources
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Users className="mr-2 h-4 w-4" />
                    {videoData.enrolled}
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Related Videos */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-white">Related Courses</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((video) => (
                <Card
                  key={video.id}
                  className="cursor-pointer overflow-hidden border-gray-800 bg-gray-900/50 transition-transform hover:scale-105"
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-medium text-white">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.instructor}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}