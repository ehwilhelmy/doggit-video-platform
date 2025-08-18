"use client"

export function ColorTest() {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 p-4 bg-white border rounded-lg shadow-lg">
      <div className="text-xs font-mono">Color Test</div>
      
      {/* Direct hex color */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6" style={{ backgroundColor: '#2E005D' }}></div>
        <span className="text-xs">#2E005D (direct)</span>
      </div>
      
      {/* CSS variable primary */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary"></div>
        <span className="text-xs">bg-primary</span>
      </div>
      
      {/* CSS variable accent */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-accent"></div>
        <span className="text-xs">bg-accent</span>
      </div>
      
      {/* Tailwind custom */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-jade-purple"></div>
        <span className="text-xs">bg-jade-purple</span>
      </div>
      
      {/* HSL direct */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6" style={{ backgroundColor: 'hsl(270, 100%, 18%)' }}></div>
        <span className="text-xs">hsl(270, 100%, 18%)</span>
      </div>
    </div>
  )
}