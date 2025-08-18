export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  previewUrl?: string
  duration: number
  category: string
  isPremium: boolean
  isLivestream?: boolean
  livestreamUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  subscriptionStatus: 'active' | 'inactive' | 'cancelled'
  subscriptionEndDate?: Date
}

export interface Category {
  id: string
  name: string
  slug: string
}