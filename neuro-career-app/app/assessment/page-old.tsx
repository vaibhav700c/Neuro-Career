"use client"
import { WaveformVisualizer } from "@/components/waveform-visualizer"
import { Button } from "@/components/ui/button"
import { NeonCard } from "@/components/neon-card"
import { VoiceRecorder, useVoiceChat } from "@/components/voice-recorder"
import { motion } from "framer-motion"
import { Mic, Square, Send, Volume2 } from "lucide-react"
import { useState, useEffect } from "react"

type Message = { role: "ai" | "user"; content: string }

export default function AssessmentPage() {
  const [textInput, setTextInput] = useState("")
  const { 
    messages, 
    isLoading, 
    error, 
    sendTextMessage, 
    playAudioResponse, 
    clearError,
    addUserMessage,
    addAIMessage 
  } = useVoiceChat()

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      addAIMessage("Hey there! Wonderful to have another enthusiast ready to explore the VR world of careers. My name is Bonita and I help analyze aptitudes to suggest career paths. Say 'yes' when you are ready to begin!")
    }
  }, [messages.length, addAIMessage])

  const handleVoiceTranscription = (transcription: string) => {
    addUserMessage(transcription)
  }

  const handleAIResponse = (response: string, audioData?: string) => {
    addAIMessage(response)
    if (audioData) {
      playAudioResponse(audioData)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    
    const userMessage = textInput.trim()
    setTextInput("")
    
    try {
      await sendTextMessage(userMessage)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const sendQuick = async (text: string) => {
    try {
      await sendTextMessage(text)
    } catch (error) {
      console.error("Failed to send quick message:", error)
    }
  }

  return (
    <main className="dark mx-auto max-w-4xl px-4 py-10 md:py-16">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">AI Career Assessment</h1>
        <p className="text-sm text-white/70">Speak with Bonita, your AI career counselor, or type your responses.</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
          <Button 
            onClick={clearError} 
            variant="ghost" 
            size="sm" 
            className="ml-2 text-red-300 hover:text-red-100"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Voice Recording Card */}
      <NeonCard className="p-4 mb-6">
        <WaveformVisualizer />
        <div className="mt-3 flex items-center gap-3">
          <VoiceRecorder
            onTranscription={handleVoiceTranscription}
            onAIResponse={handleAIResponse}
            onError={(error) => console.error("Voice recording error:", error)}
          />
          <div className="text-xs text-white/70">Click to have a voice conversation with Bonita</div>
        </div>
      </NeonCard>

      {/* Text Input Card */}
      <NeonCard className="p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Or type your response here..."
            className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            disabled={isLoading}
          />
          <Button 
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </NeonCard>

      {/* Conversation History */}
      <div className="space-y-3 mb-6">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[80%] rounded-2xl border border-white/10 p-3 text-sm ${
              m.role === "ai" ? "bg-white/5" : "ml-auto bg-[#3B82F6]/15"
            }`}
          >
            <div className="flex items-start gap-2">
              {m.role === "ai" && (
                <div className="text-xs text-white/70 font-semibold">Bonita:</div>
              )}
              <div className="flex-1">{m.content}</div>
              {m.role === "ai" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/10"
                  onClick={() => {
                    // Convert text to speech
                    fetch('http://localhost:8000/api/text-to-speech', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: m.content })
                    })
                    .then(response => response.blob())
                    .then(blob => {
                      const audioUrl = URL.createObjectURL(blob)
                      const audio = new Audio(audioUrl)
                      audio.play()
                      audio.onended = () => URL.revokeObjectURL(audioUrl)
                    })
                    .catch(error => console.error('Failed to play audio:', error))
                  }}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[80%] rounded-2xl border border-white/10 p-3 text-sm bg-white/5"
          >
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 font-semibold">Bonita:</div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Response Buttons */}
      <div className="flex flex-wrap gap-2">
        {["Yes, let's begin", "Tell me more about the assessment", "I'm interested in tech careers", "What questions will you ask?"].map((q) => (
          <Button
            key={q}
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/15"
            onClick={() => sendQuick(q)}
            disabled={isLoading}
          >
            {q}
          </Button>
        ))}
      </div>
    </main>
  )
}
