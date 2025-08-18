"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { VideoPreviewCard } from "@/components/video-preview-card"
import { 
  ChevronLeft,
  MapPin,
  Calendar,
  Award,
  Users,
  Star,
  Mail,
  ExternalLink
} from "lucide-react"

// Trainer data
const trainersData = {
  "jayme-nolan": {
    id: "jayme-nolan",
    name: "Jayme Nolan",
    title: "Puppy Training Specialist",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    location: "Seattle, WA",
    experience: "15+ years",
    specialties: ["Puppy Development", "Positive Reinforcement", "Basic Obedience"],
    certifications: ["CCPDT-KA", "CPDT-KSA", "Fear Free Certified"],
    bio: "Jayme Nolan has dedicated over 15 years to understanding and training puppies using positive reinforcement techniques. She specializes in early puppy development and has worked with thousands of families to build strong, loving relationships with their new companions. Her approach focuses on building confidence and trust while establishing essential life skills.",
    achievements: [
      "Trained over 3,000 puppies",
      "Featured in Dog Training Weekly",
      "Developed the 'Puppy Foundation Program'",
      "Guest speaker at National Pet Expo"
    ],
    rating: 4.9,
    students: 1250,
    videos: [
      {
        id: "puppy-basics",
        title: "Puppy Basics",
        duration: "15 min",
        thumbnail_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face",
        instructor: "Jayme Nolan",
        category: "Puppy Training",
        video_url: "https://drive.google.com/uc?export=download&id=1Cb0R2HcNtovUx0gSuF_L6KQeoLZZhaDk",
        description: "Master essential puppy training fundamentals with proven techniques.",
        level: "Beginner"
      }
    ]
  },
  "mike-chen": {
    id: "mike-chen",
    name: "Mike Chen",
    title: "Advanced Obedience Expert",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    location: "Portland, OR",
    experience: "12+ years",
    specialties: ["Advanced Commands", "Working Dogs", "Behavioral Modification"],
    certifications: ["CCPDT-KA", "IAABC Certified", "Service Dog Trainer"],
    bio: "Mike Chen is a certified dog behaviorist with extensive experience in advanced training techniques. He has worked with working dogs, service animals, and challenging behavioral cases. His systematic approach helps dogs and owners achieve remarkable results through clear communication and consistent training.",
    achievements: [
      "Certified 200+ service dogs",
      "Expert witness in court cases",
      "Published researcher in canine behavior",
      "Trainer for K-9 police units"
    ],
    rating: 4.8,
    students: 850,
    videos: [
      {
        id: "advanced-obedience",
        title: "Advanced Obedience Commands",
        duration: "18 min",
        thumbnail_url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face",
        instructor: "Mike Chen",
        category: "Obedience",
        description: "Take your dog's training to the next level with advanced commands.",
        level: "Advanced"
      }
    ]
  },
  "emily-rodriguez": {
    id: "emily-rodriguez",
    name: "Emily Rodriguez",
    title: "Leash Training & Walking Specialist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    location: "Austin, TX",
    experience: "10+ years",
    specialties: ["Leash Training", "Walking Behavior", "Reactive Dogs"],
    certifications: ["CCPDT-KA", "Reactive Dog Specialist", "Fear Free Certified"],
    bio: "Emily Rodriguez specializes in leash training and reactive dog rehabilitation. She has helped hundreds of dogs overcome pulling, lunging, and fearful behaviors during walks. Her patient, science-based approach has transformed countless walking experiences from stressful to enjoyable.",
    achievements: [
      "Reformed 500+ reactive dogs",
      "Created the 'Peaceful Walks' method",
      "Featured in Modern Dog Magazine",
      "Consultant for animal shelters"
    ],
    rating: 4.9,
    students: 650,
    videos: [
      {
        id: "leash-training",
        title: "Leash Training Techniques",
        duration: "15 min",
        thumbnail_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=face",
        instructor: "Emily Rodriguez",
        category: "Walking",
        description: "Learn effective leash training techniques for enjoyable walks.",
        level: "Intermediate"
      }
    ]
  }
}

function TrainerProfileContent() {
  const router = useRouter()
  const params = useParams()
  const trainerId = params.id as string
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const trainer = trainersData[trainerId as keyof typeof trainersData]
  
  useEffect(() => {
    const subscriptionActive = localStorage.getItem("subscriptionActive")
    const paymentCompleted = localStorage.getItem("paymentCompleted")
    setIsSubscribed(subscriptionActive === "true" && paymentCompleted === "true")
  }, [])

  if (!trainer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trainer Not Found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch?v=${videoId}&from=trainer`)
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
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => router.push('/classes')}
            >
              All Classes
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Trainer Hero Section */}
        <div className="bg-zinc-900 rounded-2xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-jade-purple"
              />
              <div className="mt-4 text-center lg:text-left">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{trainer.rating}/5</span>
                  <span className="text-gray-400">({trainer.students} students)</span>
                </div>
                <Button className="bg-jade-purple hover:bg-jade-purple/90 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Trainer
                </Button>
              </div>
            </div>

            {/* Trainer Details */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{trainer.name}</h1>
              <p className="text-xl mb-4" style={{ color: '#9B86FF' }}>{trainer.title}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5" style={{ color: '#9B86FF' }} />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5" style={{ color: '#9B86FF' }} />
                  <span>{trainer.experience} experience</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="h-5 w-5" style={{ color: '#9B86FF' }} />
                  <span>{trainer.students} students trained</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Award className="h-5 w-5" style={{ color: '#9B86FF' }} />
                  <span>{trainer.certifications.length} certifications</span>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">{trainer.bio}</p>

              {/* Specialties */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="border-white/30" style={{ backgroundColor: 'rgba(155, 134, 255, 0.2)', color: '#9B86FF' }}>
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="border-zinc-600 text-gray-300">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-zinc-900 rounded-2xl p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Notable Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainer.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3">
                <Award className="h-5 w-5 flex-shrink-0" style={{ color: '#9B86FF' }} />
                <span className="text-gray-300">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training Videos Section */}
        <div className="bg-zinc-900 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Training Videos</h2>
            <Button 
              variant="ghost" 
              className="hover:bg-white/20"
              style={{ color: '#9B86FF' }}
              onClick={() => router.push('/classes')}
            >
              View All Classes
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainer.videos.map((video) => (
              <VideoPreviewCard
                key={video.id}
                video={video}
                onVideoClick={handleVideoClick}
                isSubscribed={isSubscribed}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function TrainerProfile() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
      </div>
    }>
      <TrainerProfileContent />
    </Suspense>
  )
}