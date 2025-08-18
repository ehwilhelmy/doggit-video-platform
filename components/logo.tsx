import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  variant?: "default" | "white"
}

export function Logo({ size = "md", href = "/", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: { width: 80, height: 27 },   // Small version
    md: { width: 106, height: 36 },  // Original size
    lg: { width: 140, height: 48 }   // Large version
  }

  const logoContent = (
    <div className="flex items-center space-x-2">
      <Image
        src="/logo-doggit.svg"
        alt="DOGGIT Logo"
        width={sizeClasses[size].width}
        height={sizeClasses[size].height}
        className={`hover:opacity-80 transition-opacity ${
          variant === "white" 
            ? "brightness-0 invert" 
            : "dark:brightness-0 dark:invert"
        }`}
        priority
      />
      <div className={`font-heavitas font-light ${
        variant === "white" 
          ? "text-white" 
          : "text-gray-600 dark:text-white"
      } flex items-center`} style={{ fontSize: "1.35rem", lineHeight: "1" }}>
        | TRAINING
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}