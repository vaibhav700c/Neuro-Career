"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NeonButtonProps = ButtonProps & {
  glow?: boolean
  ripple?: boolean
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, glow, ripple, ...props }, ref) => {
    const btnRef = React.useRef<HTMLButtonElement | null>(null)
    React.useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement)

    const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      props.onClick?.(e)
      if (!ripple || !btnRef.current) return
      const target = btnRef.current
      const circle = document.createElement("span")
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      circle.style.width = circle.style.height = `${size}px`
      circle.style.left = `${e.clientX - rect.left - size / 2}px`
      circle.style.top = `${e.clientY - rect.top - size / 2}px`
      circle.className =
        "pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_700ms_ease-out] [mask-image:radial-gradient(circle,white,transparent_60%)]"
      target.appendChild(circle)
      setTimeout(() => circle.remove(), 700)
    }

    return (
      <Button
        ref={btnRef}
        onClick={onClick}
        className={cn(
          "relative overflow-hidden ring-2 ring-[#3B82F6]/40 hover:ring-[#3B82F6]/60",
          glow &&
            "shadow-[0_0_20px_rgba(236,72,153,0.25),0_0_30px_rgba(59,130,246,0.25)] bg-[#3B82F6] hover:bg-[#3B82F6]/90",
          className,
        )}
        {...props}
      />
    )
  },
)
NeonButton.displayName = "NeonButton"
