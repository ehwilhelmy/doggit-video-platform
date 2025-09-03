"use client"

import Link from "next/link"

export function GlobalHeader() {
  return (
    <div className="fixed top-0 z-50 w-full bg-zinc-950 border-b border-zinc-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Left side - DOGGIT Parent Brand */}
          <div className="flex items-center gap-6">
            <a 
              href="https://doggit.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              DOGG!T
            </a>
            
            <a 
              href="https://training.doggit.app" 
              className="text-white font-semibold text-sm hover:text-queen-purple transition-colors"
            >
              DOGG!T Training
            </a>
            
            <a 
              href="https://resources.doggit.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}