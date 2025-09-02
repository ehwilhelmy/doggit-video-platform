"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { SignUpModal } from "@/components/signup-modal"
import { SignInModal } from "@/components/signin-modal"
import { Menu, X, LogOut, User, Settings, Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  variant?: "landing" | "auth" | "dashboard"
  showAuth?: boolean
  showNavigation?: boolean
  isAuthenticated?: boolean
  user?: { firstName?: string; email?: string }
  onSignOut?: () => void
}

export function Header({ variant = "landing", showAuth = true, showNavigation = true, isAuthenticated = false, user, onSignOut }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { href: "#training", label: "Training" },
    { href: "#instructors", label: "Instructors" },
    { href: "#pricing", label: "Pricing" }
  ]

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      variant === "landing" 
        ? isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-950/95"
          : "bg-transparent"
        : variant === "auth"
        ? "bg-transparent"
        : "bg-white/95 shadow-sm backdrop-blur-sm dark:bg-gradient-to-b dark:from-black/80 dark:to-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Logo 
            size="md" 
            variant={
              variant === "landing" && !isScrolled 
                ? "white" 
                : "default"
            } 
          />
          
          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={variant === "landing" 
                    ? isScrolled 
                      ? "text-gray-600 hover:text-jade-purple dark:text-gray-300 dark:hover:text-white transition-colors"
                      : "text-white/80 hover:text-white transition-colors"
                    : "text-gray-600 hover:text-jade-purple dark:text-gray-300 dark:hover:text-white transition-colors"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Auth Buttons */}
          {showAuth && !isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                className={variant === "landing" 
                  ? isScrolled
                    ? "text-gray-600 hover:text-jade-purple"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-jade-purple"}
                onClick={() => setShowSignInModal(true)}
              >
                Login
              </Button>
              <Button
                className="bg-queen-purple hover:bg-queen-purple/90 text-white"
                onClick={() => window.location.href = '/membership'}
                data-signup-trigger
              >
                Subscribe Now
              </Button>
            </div>
          )}

          {/* Authenticated User */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                className={variant === "landing" 
                  ? isScrolled
                    ? "text-gray-600 hover:text-jade-purple"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-jade-purple"}
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarFallback className="bg-queen-purple text-white">
                      {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/settings/preferences'} 
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/admin/simple'} 
                    className="gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          {showNavigation && (
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && showNavigation && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-600 hover:text-jade-purple dark:text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {showAuth && !isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setShowSignInModal(true)
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = '/membership'
                  }}
                  data-signup-trigger
                >
                  Subscribe Now
                </Button>
              </div>
            )}

            {isAuthenticated && user && (
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = '/dashboard'
                  }}
                >
                  Go to my dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setIsMenuOpen(false)
                    onSignOut?.()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      <SignUpModal 
        open={showSignUpModal} 
        onOpenChange={setShowSignUpModal}
        selectedTrainingGoals={[]}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false)
          setTimeout(() => setShowSignInModal(true), 100)
        }}
      />

      {/* Sign In Modal */}
      <SignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={() => {
          setShowSignInModal(false)
          setTimeout(() => setShowSignUpModal(true), 100)
        }}
      />
    </header>
  )
}