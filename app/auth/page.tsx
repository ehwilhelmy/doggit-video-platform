"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, Check, Star, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const { data, error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else if (data.user) {
        // User created successfully, redirect to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="absolute top-4 left-8 z-50">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-jade-purple dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      </div>
      <Header variant="auth" showAuth={false} showNavigation={false} />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1920"
            alt="Adorable puppy background"
            className="h-full w-full object-cover opacity-10 blur-sm dark:opacity-5"
          />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <Card className="border-purple-100 bg-white/98 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-2xl font-bold text-jade-purple dark:text-white">
                Dog Training Hub
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Learn from expert trainers and transform your pup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-purple-50">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-purple-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-login" className="text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password-login"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-purple-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full "
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-gray-600 hover:text-jade-purple">
                      Forgot password?
                    </a>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-purple-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-purple-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full "
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </form>
                  <p className="mt-4 text-center text-xs text-gray-600">
                    By signing up, you agree to our Terms of Service
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Pricing Preview */}
          <div className="mt-8 rounded-xl border border-purple-100 bg-white/98 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900/90">
            <h3 className="mb-4 text-center text-lg font-semibold text-jade-purple">
              Choose Your Plan After Sign Up
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-purple-50/50 p-3 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-queen-purple" />
                  <span className="text-sm text-gray-700">Unlimited streaming</span>
                </div>
                <span className="text-sm font-bold text-jade-purple">$9.99/mo</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-purple-50/50 p-3 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-queen-purple" />
                  <span className="text-sm text-gray-700">HD & 4K quality</span>
                </div>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-purple-50/50 p-3 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-queen-purple" />
                  <span className="text-sm text-gray-700">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-jade-purple to-queen-purple">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-jade-purple">Watch Anywhere</h3>
              <p className="text-sm text-gray-600">
                Stream on your phone, tablet, laptop, and TV
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-jade-purple to-queen-purple">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-jade-purple">Premium Content</h3>
              <p className="text-sm text-gray-600">
                Exclusive videos and live events
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-jade-purple to-queen-purple">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-jade-purple">No Commitments</h3>
              <p className="text-sm text-gray-600">
                Cancel your subscription anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}