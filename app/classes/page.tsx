"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { VideoPreviewCard } from "@/components/video-preview-card"
import { 
  ChevronLeft,
  Search,
  Filter,
  Clock,
  Star,
  Users,
  BookOpen
} from "lucide-react"

// All classes data
const allClasses = [
  {
    id: "puppy-basics",
    title: "Puppy Basics",
    duration: "15 min",
    thumbnail_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face",
    instructor: "Jayme Nolan",
    instructorId: "jayme-nolan",
    category: "Puppy Training",
    level: "Beginner",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    description: "Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan.",
    rating: 4.9,
    students: 1250,
    tags: ["basic commands", "house training", "socialization"]
  },
  {
    id: "advanced-obedience",
    title: "Advanced Obedience Commands",
    duration: "18 min",
    thumbnail_url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face",
    instructor: "Mike Chen",
    instructorId: "mike-chen",
    category: "Obedience",
    level: "Advanced",
    description: "Take your dog's training to the next level with advanced obedience commands and techniques.",
    rating: 4.8,
    students: 850,
    tags: ["advanced commands", "heel", "distance commands", "recall"]
  },
  {
    id: "leash-training",
    title: "Leash Training Techniques",
    duration: "15 min",
    thumbnail_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=face",
    instructor: "Emily Rodriguez",
    instructorId: "emily-rodriguez",
    category: "Walking",
    level: "Intermediate",
    description: "Learn effective leash training techniques to make walks enjoyable for both you and your dog.",
    rating: 4.9,
    students: 650,
    tags: ["leash training", "pulling", "walking", "equipment"]
  }
]

const categories = ["All", "Puppy Training", "Obedience", "Walking", "Behavior"]
const levels = ["All", "Beginner", "Intermediate", "Advanced"]

function ClassesPageContent() {
  const router = useRouter()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [filteredClasses, setFilteredClasses] = useState(allClasses)

  useEffect(() => {
    const subscriptionActive = localStorage.getItem("subscriptionActive")
    const paymentCompleted = localStorage.getItem("paymentCompleted")
    setIsSubscribed(subscriptionActive === "true" && paymentCompleted === "true")
  }, [])

  // Filter classes based on search and filters
  useEffect(() => {
    let filtered = allClasses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== "All") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    setFilteredClasses(filtered)
  }, [searchTerm, selectedCategory, selectedLevel])

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch?v=${videoId}&from=classes`)
  }

  const handleTrainerClick = (trainerId: string) => {
    router.push(`/trainer/${trainerId}`)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <Logo size="sm" variant="white" />
            <div className="h-8 w-px bg-zinc-700 hidden md:block" />
            <h1 className="text-lg lg:text-xl font-semibold text-white hidden md:block">All Classes</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Master Dog Training with Expert-Led Classes
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn from certified trainers with proven techniques. From puppy basics to advanced commands, 
            find the perfect class for your dog's needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search classes, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-jade-purple"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-jade-purple hover:bg-jade-purple/90 text-white font-medium"
                      : "border-zinc-300 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-white"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex gap-2 flex-wrap">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={
                    selectedLevel === level
                      ? "bg-queen-purple hover:bg-queen-purple/90 text-white font-medium"
                      : "border-zinc-300 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-white"
                  }
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-300">
            <span className="font-semibold">{filteredClasses.length}</span> classes found
            {searchTerm && (
              <span> for "<span className="text-white">{searchTerm}</span>"</span>
            )}
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((course) => (
              <VideoPreviewCard
                key={course.id}
                video={course}
                onVideoClick={handleVideoClick}
                isSubscribed={isSubscribed}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No classes found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              className="bg-jade-purple hover:bg-jade-purple/90 text-white font-medium"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedLevel("All")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ClassesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
      </div>
    }>
      <ClassesPageContent />
    </Suspense>
  )
}