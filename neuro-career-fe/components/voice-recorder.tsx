"use client"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2, Volume2 } from "lucide-react"
import axios from "axios"

interface VoiceRecorderProps {
  onTranscription?: (text: string) => void
  onAIResponse?: (response: string) => void
  onError?: (error: string) => void
  onStartRecording?: () => void
  apiBaseUrl?: string
  disabled?: boolean
}

export function VoiceRecorder({
  onTranscription,
  onAIResponse,
  onError,
  onStartRecording,
  apiBaseUrl = "http://localhost:8000",
  disabled = false
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      // Call the callback when recording starts
      onStartRecording?.()
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      onError?.(`Failed to start recording: ${error}`)
    }
  }, [onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
    }
  }, [isRecording])

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Only process if we have meaningful audio data
      if (audioBlob.size < 1000) {
        onError?.("Recording too short. Please speak for at least 1 second.")
        return
      }

      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')

      // First transcribe the audio
      const transcribeResponse = await axios.post(`${apiBaseUrl}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      })

      const transcription = transcribeResponse.data.transcription
      
      if (!transcription || transcription.trim().length === 0) {
        onError?.("No speech detected. Please try speaking more clearly.")
        return
      }

      // Send transcription to user
      onTranscription?.(transcription)

      // Get AI response
      const chatResponse = await axios.post(`${apiBaseUrl}/api/chat`, {
        message: transcription
      })

      const aiResponse = chatResponse.data.response
      onAIResponse?.(aiResponse)
      
    } catch (error) {
      console.error("Audio processing error:", error)
      onError?.(`Failed to process audio: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <Button
      onClick={toggleRecording}
      disabled={disabled || isProcessing}
      className={`${
        isRecording 
          ? "bg-red-500 hover:bg-red-600 animate-pulse" 
          : "bg-blue-500 hover:bg-blue-600"
      } ${(disabled || isProcessing) ? "opacity-50 cursor-not-allowed" : ""}`}
      size="sm"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isRecording ? (
        <>
          <Square className="mr-2 h-4 w-4" />
          Stop
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          Voice
        </>
      )}
    </Button>
  )
}

// Hook for managing voice chat state
export function useVoiceChat(apiBaseUrl = "http://localhost:8000") {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendTextMessage = async (message: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }])
      
      const response = await axios.post(`${apiBaseUrl}/api/chat`, {
        message
      })
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }])
      
      return response.data.response
    } catch (err) {
      const errorMsg = `Failed to send message: ${err}`
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const playAudioResponse = async (audioHex: string) => {
    try {
      // Convert hex string back to binary
      const audioData = new Uint8Array(audioHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.play()
      
      // Clean up URL after playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    } catch (err) {
      setError(`Failed to play audio: ${err}`)
    }
  }

  const clearMessages = () => setMessages([])
  const clearError = () => setError(null)

  return {
    messages,
    isLoading,
    error,
    sendTextMessage,
    playAudioResponse,
    clearMessages,
    clearError,
    addUserMessage: (content: string) => setMessages(prev => [...prev, { role: 'user', content }]),
    addAIMessage: (content: string) => setMessages(prev => [...prev, { role: 'ai', content }])
  }
}