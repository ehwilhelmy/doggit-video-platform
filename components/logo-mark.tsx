import Image from "next/image"

interface LogoMarkProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

export function LogoMark({ size = "md", variant = "default" }: LogoMarkProps) {
  const sizeClasses = {
    sm: { width: 40, height: 40 },
    md: { width: 56, height: 56 },
    lg: { width: 72, height: 72 }
  }

  return (
    <Image
      src="/doggit-logo-mark.svg"
      alt="DOGGIT Logo"
      width={sizeClasses[size].width}
      height={sizeClasses[size].height}
      className={`${
        variant === "white" 
          ? "brightness-0 invert opacity-90" 
          : ""
      }`}
      style={{ color: "transparent" }}
      priority
    />
  )
}