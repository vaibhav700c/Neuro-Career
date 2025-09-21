"use client"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Button } from "@/components/ui/button"
import { NeonCard } from "@/components/neon-card"
import { motion } from "framer-motion"
import { Send, Volume2, VolumeX, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"

type Message = { 
  id: number
  role: "ai" | "user"
  content: string
  timestamp: Date
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
// Default to demo mode in production if env vars aren't set
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || (!process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NODE_ENV === 'production')
const USE_MOCK_RESPONSES = process.env.NEXT_PUBLIC_USE_MOCK_RESPONSES === 'true' || DEMO_MODE

// Debug logging for production troubleshooting
if (typeof window !== 'undefined') {
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    DEMO_MODE,
    USE_MOCK_RESPONSES,
    API_BASE_URL
  })
}

// Mock responses for demo mode
const MOCK_RESPONSES = [
  "Hello! I'm Bonita, your AI career counselor. I'm here to help you discover your ideal career path through our advanced assessment. What brings you here today?",
  "That's wonderful! Career exploration is such an important journey. Let's start by understanding your interests. What activities or subjects do you find most engaging?",
  "Excellent! Those interests suggest you might thrive in fields that combine creativity with analytical thinking. Can you tell me about a time when you felt really accomplished or proud of something you created or solved?",
  "That's a great example! It shows you have strong problem-solving skills and attention to detail. Now, let's think about your ideal work environment. Do you prefer working independently, in small teams, or with large groups of people?",
  "Based on what you've shared so far, I'm seeing some interesting patterns. You seem to have a good balance of creative and analytical thinking, with strong collaborative skills. Let me ask you this: what does career success look like to you personally?",
  "That's a very thoughtful perspective on success. It tells me you value both personal fulfillment and making a positive impact. Based on our conversation, I'd like to suggest a few career paths that might align with your interests and values. Would you like me to share some recommendations?",
  "Wonderful! Based on your responses, here are some career paths I'd recommend exploring: 1) UX/UI Design - combines creativity with problem-solving, 2) Data Science - analytical work with real-world impact, 3) Product Management - collaborative role bridging technical and creative teams. Which of these resonates most with you?"
]

export default function AssessmentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [textInput, setTextInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<number | null>(null)
  const [shouldUseBrowserTTS, setShouldUseBrowserTTS] = useState(false)
  const [mockResponseIndex, setMockResponseIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const hasSpokenInitialRef = useRef(false)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messageIdRef = useRef(0) // Track message IDs
  const lastTTSRequestRef = useRef<string>('') // Track last TTS request to prevent duplicates
  const lastTTSStatusCheck = useRef<number>(0) // Track when we last checked TTS status

    // Function to check TTS status and decide whether to use ElevenLabs or browser TTS
  const checkTTSStatus = async () => {
    // In demo mode, always use browser TTS
    if (DEMO_MODE) {
      setShouldUseBrowserTTS(true)
      console.log("Demo mode: Using browser speech synthesis")
      return
    }
    
    const now = Date.now()
    // Only check status every 30 seconds to avoid spam
    if (now - lastTTSStatusCheck.current < 30000) {
      return
    }
    lastTTSStatusCheck.current = now

    try {
      const response = await axios.get(`${API_BASE_URL}/api/tts-status`, {
        timeout: 3000
      })
      
      if (response.data && typeof response.data.can_use_elevenlabs === 'boolean') {
        setShouldUseBrowserTTS(!response.data.can_use_elevenlabs)
        
        if (!response.data.can_use_elevenlabs) {
          console.log("TTS Status: Switching to browser speech synthesis due to quota/rate limits or unusual activity")
        } else {
          console.log(`TTS Status: ElevenLabs available, ${response.data.requests_remaining} requests remaining`)
        }
      }
    } catch (error: any) {
      console.warn("Could not check TTS status, defaulting to browser speech synthesis:", error)
      // Default to browser TTS if we can't check status
      setShouldUseBrowserTTS(true)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  // Initialize conversation
  useEffect(() => {
    if (!hasStarted) {
      const initialMessage: Message = {
        id: ++messageIdRef.current,
        role: "ai",
        content: DEMO_MODE ? MOCK_RESPONSES[0] : "Hello! I'm Bonita, your AI career counselor. I'm here to help you explore career paths that match your interests and skills.",
        timestamp: new Date()
      }
      setMessages([initialMessage])
      setHasStarted(true)
      
      // Initialize mock response counter if in demo mode
      if (DEMO_MODE && USE_MOCK_RESPONSES) {
        setMockResponseIndex(1) // Start from 1 since we used index 0 for initial message
      }
      
      // Automatically speak the initial greeting after a delay
      setTimeout(() => {
        if (!hasSpokenInitialRef.current) {
          hasSpokenInitialRef.current = true
          playTextToSpeech(initialMessage.content, initialMessage.id)
        }
      }, 1500)
    }
  }, [hasStarted]) // Only depend on hasStarted, not messages.length

  const addMessage = (role: "ai" | "user", content: string) => {
    const newMessage: Message = {
      id: ++messageIdRef.current,
      role,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const sendTextMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    
    try {
      // Add user message
      addMessage("user", message)
      setTextInput("")
      
      // Get AI response - use mock responses in demo mode
      let aiResponse: string
      
      if (DEMO_MODE && USE_MOCK_RESPONSES) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
        
        // Get next mock response
        aiResponse = MOCK_RESPONSES[mockResponseIndex % MOCK_RESPONSES.length]
        setMockResponseIndex(prev => prev + 1)
      } else {
        // Use real API
        const response = await axios.post(`${API_BASE_URL}/api/chat`, {
          message
        })
        aiResponse = response.data.response
      }
      
      const aiMessage = addMessage("ai", aiResponse)
      
      // Speak the AI response (will use browser TTS in demo mode)
      setTimeout(() => {
        playTextToSpeech(aiResponse, aiMessage.id)
      }, 300)
      
    } catch (err) {
      console.error("Failed to send message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const playTextToSpeech = async (text: string, messageId?: number) => {
    // Prevent duplicate TTS requests for the same text
    const textKey = `${text.substring(0, 100)}_${messageId || 'unknown'}`
    if (lastTTSRequestRef.current === textKey) {
      return
    }
    lastTTSRequestRef.current = textKey
    
    // Prevent multiple simultaneous audio
    if (isPlayingAudio) {
      stopAudio()
      // Wait for stop to complete
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Additional check: If this is the initial greeting and already spoken, skip
    if (messageId === 1 && hasSpokenInitialRef.current) {
      return
    }

    // Check TTS status proactively
    await checkTTSStatus()

    // Browser fallback function with improved error handling
    const useBrowserSpeech = () => {
      try {
        if ('speechSynthesis' in window) {
          // Cancel any existing speech
          speechSynthesis.cancel()
          
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9
          utterance.pitch = 1
          utterance.volume = 0.8
          
          // Try to get a better voice if available
          const voices = speechSynthesis.getVoices()
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google'))
          )
          if (preferredVoice) {
            utterance.voice = preferredVoice
          }
          
          utterance.onstart = () => {
            console.log("Browser speech synthesis started")
          }
          
          utterance.onend = () => {
            console.log("Browser speech synthesis ended")
            setIsPlayingAudio(false)
            setCurrentPlayingMessageId(null)
            lastTTSRequestRef.current = '' // Reset duplicate tracking
          }
          
          utterance.onerror = (event) => {
            console.error("Browser speech synthesis error:", event)
            setIsPlayingAudio(false)
            setCurrentPlayingMessageId(null)
            lastTTSRequestRef.current = '' // Reset duplicate tracking
          }
          
          speechSynthesis.speak(utterance)
          console.log("Using browser speech synthesis")
          return true
        }
      } catch (fallbackError) {
        console.error("Browser speech synthesis fallback failed:", fallbackError)
        setIsPlayingAudio(false)
        setCurrentPlayingMessageId(null)
        lastTTSRequestRef.current = '' // Reset duplicate tracking
        return false
      }
      return false
    }
    
    try {
      setIsPlayingAudio(true)
      if (messageId) {
        setCurrentPlayingMessageId(messageId)
      }
      
      // If we should use browser TTS (due to quota limits), skip ElevenLabs API
      if (shouldUseBrowserTTS) {
        console.log("Using browser speech synthesis due to quota status")
        if (useBrowserSpeech()) {
          return
        } else {
          throw new Error("Browser speech synthesis failed")
        }
      }
      
      // Try ElevenLabs API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await axios.post(`${API_BASE_URL}/api/text-to-speech`, {
          message: text
        }, {
          responseType: 'blob',
          timeout: 8000, // 8 second axios timeout
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        // Check if response is successful
        if (response.status === 200 && response.data) {
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' })
          const audioUrl = URL.createObjectURL(audioBlob)
          
          const audio = new Audio(audioUrl)
          currentAudioRef.current = audio
          
          audio.onended = () => {
            console.log("ElevenLabs audio playback ended")
            setIsPlayingAudio(false)
            setCurrentPlayingMessageId(null)
            lastTTSRequestRef.current = '' // Reset duplicate tracking
            URL.revokeObjectURL(audioUrl)
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null
            }
          }
          
          audio.onerror = (e) => {
            console.error("ElevenLabs audio playback error:", e)
            setIsPlayingAudio(false)
            setCurrentPlayingMessageId(null)
            lastTTSRequestRef.current = '' // Reset duplicate tracking
            URL.revokeObjectURL(audioUrl)
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null
            }
            // Try browser fallback on audio error
            useBrowserSpeech()
          }

          // Play audio
          try {
            await audio.play()
            console.log("ElevenLabs audio playback started successfully")
          } catch (playError) {
            console.error("ElevenLabs audio play() failed:", playError)
            // Fallback to browser speech if audio play fails
            if (!useBrowserSpeech()) {
              throw playError
            }
          }
        } else {
          throw new Error("Invalid response from TTS API")
        }
        
      } catch (apiError: any) {
        clearTimeout(timeoutId)
        
        // Check for quota/rate limit errors
        if (apiError.response?.status === 429 || 
            (apiError.response?.status >= 400 && apiError.response?.status < 500)) {
          console.log("ElevenLabs API quota/rate limit exceeded, switching to browser speech synthesis")
          
          // Update preference to use browser TTS going forward
          setShouldUseBrowserTTS(true)
          
          if (!useBrowserSpeech()) {
            throw new Error("Both ElevenLabs API and browser speech synthesis failed")
          }
        } else if (apiError.code === 'ECONNABORTED' || apiError.name === 'AbortError') {
          console.log("ElevenLabs API timeout, using browser speech synthesis fallback")
          
          if (!useBrowserSpeech()) {
            throw new Error("ElevenLabs API timeout and browser speech synthesis failed")
          }
        } else {
          console.error("ElevenLabs API error:", apiError)
          
          // Try browser fallback for any other API error
          if (!useBrowserSpeech()) {
            throw apiError
          }
        }
      }
      
    } catch (error: any) {
      console.error("TTS failed completely:", error)
      setIsPlayingAudio(false)
      setCurrentPlayingMessageId(null)
      lastTTSRequestRef.current = '' // Reset duplicate tracking
      
      // Last resort: try browser speech one more time
      if (!useBrowserSpeech()) {
        console.error("All TTS methods failed")
      }
    }
  }

  const stopAudio = () => {
    console.log("Stopping audio...")
    
    // Stop audio element
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause()
        currentAudioRef.current.currentTime = 0
        currentAudioRef.current.src = ''
      } catch (e) {
        console.log("Error stopping audio element (expected):", e)
      }
      currentAudioRef.current = null
    }

    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }

    // Reset state
    setIsPlayingAudio(false)
    setCurrentPlayingMessageId(null)
    lastTTSRequestRef.current = '' // Reset duplicate tracking
    console.log("Audio stopped and state reset")
  }

  const handleVoiceTranscription = (transcription: string) => {
    addMessage("user", transcription)
  }

    const handleAIResponse = (response: string) => {
    const aiMessage = addMessage("ai", response)
    // Auto-play the AI response
    setTimeout(() => {
      playTextToSpeech(response, aiMessage.id)
    }, 300)
  }

  const handleTextSubmit = () => {
    sendTextMessage(textInput)
  }

  const handleQuickResponse = (response: string) => {
    sendTextMessage(response)
  }

  const clearError = () => setError(null)

  return (
    <main className="dark mx-auto max-w-4xl px-4 py-6 h-screen flex flex-col">
      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Demo Mode</span>
          </div>
          <p className="text-sm text-blue-200 mt-1">
            You're experiencing a frontend-only demo with pre-written responses and browser-based text-to-speech.
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">AI Career Assessment</h1>
        <p className="text-sm text-white/70">Chat with Bonita, your AI career counselor</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 flex justify-between items-center">
          <span>{error}</span>
          <Button 
            onClick={clearError} 
            variant="ghost" 
            size="sm" 
            className="text-red-300 hover:text-red-100 h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 mb-4 overflow-hidden">
        <NeonCard className="h-full p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                    message.role === "ai"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30"
                      : "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      {message.role === "ai" && (
                        <div className="text-xs text-blue-300 font-semibold mb-1">Bonita</div>
                      )}
                      <div className="text-white">{message.content}</div>
                    </div>
                    {message.role === "ai" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-white/10 flex-shrink-0"
                        onClick={() => {
                          console.log("Speaker button clicked for message:", message.id)
                          if (isPlayingAudio && currentPlayingMessageId === message.id) {
                            console.log("Stopping audio for this message")
                            stopAudio()
                          } else {
                            console.log("Playing TTS for:", message.content.substring(0, 50) + "...")
                            // Reset duplicate tracking for manual button clicks
                            lastTTSRequestRef.current = ''
                            playTextToSpeech(message.content, message.id)
                          }
                        }}
                        disabled={isLoading}
                        title={
                          isPlayingAudio && currentPlayingMessageId === message.id 
                            ? "Stop audio" 
                            : "Play audio"
                        }
                      >
                        {isPlayingAudio && currentPlayingMessageId === message.id ? (
                          <VolumeX className="h-4 w-4 text-orange-400" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-blue-400" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                  <div className="text-xs text-blue-300 font-semibold mb-1">Bonita</div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </NeonCard>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        {/* Text Input */}
        <NeonCard className="p-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleTextSubmit()}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              disabled={isLoading}
            />
            <Button 
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              onAIResponse={handleAIResponse}
              onError={(error: string) => setError(error)}
              apiBaseUrl={API_BASE_URL}
              disabled={isLoading}
            />
          </div>
        </NeonCard>

        {/* Quick Response Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            "Yes, let's begin",
            "I'm a student",
            "I'm interested in technology",
            "Tell me about software engineering",
            "What questions will you ask?",
            "I need career guidance"
          ].map((response) => (
            <Button
              key={response}
              size="sm"
              variant="secondary"
              className="bg-white/10 hover:bg-white/15 text-xs"
              onClick={() => handleQuickResponse(response)}
              disabled={isLoading}
            >
              {response}
            </Button>
          ))}
        </div>
      </div>
    </main>
  )
}