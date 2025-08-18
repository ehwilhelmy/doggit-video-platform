"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { 
  Calendar, 
  Filter, 
  Settings, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  PlayCircle,
  BookOpen,
  Award,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    start: "06/08/2025",
    end: "06/11/2025"
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-xl font-semibold">Training Analytics</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              View Settings
            </Button>
            <div className="text-xs text-muted-foreground">
              Last updated: 06/11/2025 at 12:41 PM
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
          <div className="p-4 space-y-2">
            <div className="text-sm font-medium text-foreground mb-4">Training Progress</div>
            <nav className="space-y-1">
              <Button variant="secondary" className="w-full justify-start gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                Overview
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <PlayCircle className="h-4 w-4" />
                Videos Watched
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                Courses
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Target className="h-4 w-4" />
                Goals
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Award className="h-4 w-4" />
                Achievements
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <Activity className="h-4 w-4" />
                Activity Log
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Date Range and Filters */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Training Overview</h2>
              <p className="text-muted-foreground">Track your dog training progress and engagement</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Start Date</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-32 text-sm"
                  />
                  <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">End Date</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-32 text-sm"
                  />
                  <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Training Sessions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-sm font-medium text-muted-foreground">Total Sessions</div>
                  </div>
                  <PlayCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">87.5%</div>
                    <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                    <div className="text-xs text-muted-foreground">Training Progress</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Active Goals */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm font-medium text-muted-foreground">Active Goals</div>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Time Spent */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">24.5h</div>
                    <div className="text-sm font-medium text-muted-foreground">Time Spent</div>
                    <div className="text-xs text-muted-foreground">This month</div>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goals Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm font-medium text-muted-foreground">Goals Completed</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">85.7%</div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Assessments */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm font-medium text-muted-foreground">Skills Mastered</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">92.3%</div>
                  <div className="text-xs text-muted-foreground">Success by Skill</div>
                </div>
              </CardContent>
            </Card>

            {/* Transferred Skills */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm font-medium text-muted-foreground">Skills Applied</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Progress by Topic */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Progress by Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <div>No data.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills Being Practiced */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Skills Being Practiced</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <div>No data.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Training Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <div>No data.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Mastery Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skill Mastery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <div>No data.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Training Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 10 Training Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <div>No data.</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}