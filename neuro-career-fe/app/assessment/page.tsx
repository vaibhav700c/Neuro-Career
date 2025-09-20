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

export default function AssessmentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [textInput, setTextInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const hasSpokenInitialRef = useRef(false)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messageIdRef = useRef(0) // Track message IDs
  const lastTTSRequestRef = useRef<string>('') // Track last TTS request to prevent duplicates

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
        content: "Hello! I'm Bonita, your AI career counselor. I'm here to help you explore career paths that match your interests and skills. To get started, could you tell me a bit about yourself - maybe your age, what you're currently studying, or what kind of work interests you?",
        timestamp: new Date()
      }
      setMessages([initialMessage])
      setHasStarted(true)
      
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
      
      // Get AI response
      const response = await axios.post("http://localhost:8000/api/chat", {
        message
      })
      
      const aiResponse = response.data.response
      const aiMessage = addMessage("ai", aiResponse)
      
      // Speak the AI response
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
    
    try {
      setIsPlayingAudio(true)
      if (messageId) {
        setCurrentPlayingMessageId(messageId)
      }
      
      // Use ElevenLabs API only
      const response = await axios.post("http://localhost:8000/api/text-to-speech", {
        message: text
      }, {
        responseType: 'blob'
      })
      
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      
      audio.onended = () => {
        console.log("Audio playback ended")
        setIsPlayingAudio(false)
        setCurrentPlayingMessageId(null)
        lastTTSRequestRef.current = '' // Reset duplicate tracking
        URL.revokeObjectURL(audioUrl)
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
      }
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlayingAudio(false)
        setCurrentPlayingMessageId(null)
        lastTTSRequestRef.current = '' // Reset duplicate tracking
        URL.revokeObjectURL(audioUrl)
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
      }

      // Play audio
      try {
        await audio.play()
        console.log("Audio playback started successfully")
      } catch (playError) {
        console.error("Audio play() failed:", playError)
        throw playError
      }
      
    } catch (error: any) {
      console.error("TTS failed:", error)
      setIsPlayingAudio(false)
      setCurrentPlayingMessageId(null)
      
      // Check if it's an API quota error
      if (error.response?.status === 401 || error.response?.status === 429) {
        console.log("ElevenLabs API quota exceeded, trying browser speech synthesis fallback")
        
        // Fallback to browser's built-in speech synthesis
        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 0.9
            utterance.pitch = 1
            utterance.volume = 1
            
            utterance.onend = () => {
              setIsPlayingAudio(false)
              setCurrentPlayingMessageId(null)
            }
            
            utterance.onerror = () => {
              setIsPlayingAudio(false)
              setCurrentPlayingMessageId(null)
              console.error("Browser speech synthesis failed")
            }
            
            speechSynthesis.speak(utterance)
            console.log("Using browser speech synthesis as fallback")
          }
        } catch (fallbackError) {
          console.error("Browser speech synthesis fallback failed:", fallbackError)
        }
      } else {
        console.error("Network or other TTS error:", error)
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