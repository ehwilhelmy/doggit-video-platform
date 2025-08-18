"use client"

import dynamic from 'next/dynamic'

const LandingPageClient = dynamic(() => import('./page-client'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
  </div>
})

export default function LandingPage() {
  return <LandingPageClient />
}