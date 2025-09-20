"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface VoiceGlobeProps {
  isActive?: boolean
  state?: 'idle' | 'listening' | 'processing' | 'speaking'
  audioLevel?: number
  className?: string
}

export function VoiceGlobe({ 
  isActive = false, 
  state = 'idle',
  audioLevel = 0,
  className = "" 
}: VoiceGlobeProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0)

  // Update pulse intensity based on audio level
  useEffect(() => {
    if (state === 'listening' && audioLevel > 0) {
      setPulseIntensity(audioLevel)
    } else if (state === 'processing') {
      setPulseIntensity(0.6)
    } else if (state === 'speaking') {
      setPulseIntensity(0.8)
    } else {
      setPulseIntensity(0.2)
    }
  }, [state, audioLevel])

  // Animation variants for different states
  const getAnimationVariants = () => {
    const baseScale = 1 + pulseIntensity * 0.3
    const baseOpacity = 0.3 + pulseIntensity * 0.7

    switch (state) {
      case 'listening':
        return {
          scale: [baseScale * 0.8, baseScale * 1.2, baseScale * 0.8],
          opacity: [baseOpacity * 0.6, baseOpacity, baseOpacity * 0.6],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      
      case 'processing':
        return {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear" as const
          }
        }
      
      case 'speaking':
        return {
          scale: [1, 1.15, 1.05, 1.2, 1],
          opacity: [0.8, 1, 0.9, 1, 0.8],
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      
      default: // idle
        return {
          scale: [1, 1.02, 1],
          opacity: [0.4, 0.6, 0.4],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
    }
  }

  // Color scheme based on state
  const getColors = () => {
    switch (state) {
      case 'listening':
        return {
          primary: '#3B82F6', // blue
          secondary: '#60A5FA',
          accent: '#93C5FD'
        }
      case 'processing':
        return {
          primary: '#F59E0B', // amber
          secondary: '#FCD34D',
          accent: '#FDE68A'
        }
      case 'speaking':
        return {
          primary: '#10B981', // emerald
          secondary: '#34D399',
          accent: '#6EE7B7'
        }
      default:
        return {
          primary: '#6366F1', // indigo
          secondary: '#818CF8',
          accent: '#A5B4FC'
        }
    }
  }

  const colors = getColors()
  
  if (!isActive) {
    return null
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border-2 opacity-30"
        style={{ borderColor: colors.accent }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 0.5
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-2 opacity-50"
        style={{ borderColor: colors.secondary }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 0.2
        }}
      />
      
      {/* Core globe */}
      <motion.div
        className="relative w-16 h-16 rounded-full"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${colors.primary})`,
          boxShadow: `0 0 20px ${colors.primary}40, inset 0 0 20px ${colors.secondary}30`
        }}
        animate={getAnimationVariants()}
      >
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-2 rounded-full opacity-80"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${colors.secondary}60, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        {/* Highlight spot */}
        <div
          className="absolute top-2 left-2 w-3 h-3 rounded-full opacity-90"
          style={{
            background: `radial-gradient(circle, white, ${colors.accent})`
          }}
        />
      </motion.div>
      
      {/* Audio level indicator rings (only during listening) */}
      {state === 'listening' && audioLevel > 0.1 && (
        <>
          <motion.div
            className="absolute w-20 h-20 rounded-full border"
            style={{ borderColor: colors.primary }}
            animate={{
              scale: [1, 1 + audioLevel * 0.5],
              opacity: [0.8, 0.2],
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut" as const
            }}
          />
          <motion.div
            className="absolute w-28 h-28 rounded-full border"
            style={{ borderColor: colors.secondary }}
            animate={{
              scale: [1, 1 + audioLevel * 0.8],
              opacity: [0.6, 0.1],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut" as const
            }}
          />
        </>
      )}
    </div>
  )
}