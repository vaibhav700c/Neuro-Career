"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2, MessageSquare } from "lucide-react"
import axios from "axios"

interface EnhancedVoiceRecorderProps {
  onTranscription?: (text: string) => void
  onAIResponse?: (response: string) => void
  onError?: (error: string) => void
  onAudioLevel?: (level: number) => void
  onStateChange?: (state: 'idle' | 'listening' | 'processing' | 'speaking') => void
  apiBaseUrl?: string
  disabled?: boolean
  voiceMode?: boolean
  onToggleVoiceMode?: () => void
}

export function EnhancedVoiceRecorder({
  onTranscription,
  onAIResponse,
  onError,
  onAudioLevel,
  onStateChange,
  apiBaseUrl = "http://localhost:8000",
  disabled = false,
  voiceMode = false,
  onToggleVoiceMode
}: EnhancedVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentState, setCurrentState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Update state and notify parent
  const updateState = useCallback((state: 'idle' | 'listening' | 'processing' | 'speaking') => {
    setCurrentState(state)
    onStateChange?.(state)
  }, [onStateChange])

  // Audio level detection
  const startAudioLevelDetection = useCallback((stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const audioContext = audioContextRef.current
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    source.connect(analyser)
    
    analyserRef.current = analyser

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecording) return
      
      analyser.getByteFrequencyData(dataArray)
      
      // Calculate RMS (Root Mean Square) for audio level
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i]
      }
      const rms = Math.sqrt(sum / dataArray.length)
      const level = Math.min(rms / 128, 1) // Normalize to 0-1
      
      onAudioLevel?.(level)
      
      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
    }
    
    updateAudioLevel()
  }, [isRecording, onAudioLevel])

  // Cleanup audio detection
  const stopAudioLevelDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    analyserRef.current = null
  }, [])

  const startRecording = useCallback(async () => {
    try {
      updateState('listening')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      streamRef.current = stream
      
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
        streamRef.current = null
        stopAudioLevelDetection()
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start audio level detection
      startAudioLevelDetection(stream)
      
    } catch (error) {
      updateState('idle')
      onError?.(`Failed to start recording: ${error}`)
    }
  }, [onError, updateState, startAudioLevelDetection, stopAudioLevelDetection])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
      updateState('processing')
    }
  }, [isRecording, updateState])

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Only process if we have meaningful audio data
      if (audioBlob.size < 1000) {
        onError?.("Recording too short. Please speak for at least 1 second.")
        updateState('idle')
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
        updateState('idle')
        return
      }

      // Send transcription to user
      onTranscription?.(transcription)

      // Get AI response
      const chatResponse = await axios.post(`${apiBaseUrl}/api/chat`, {
        message: transcription
      })

      const aiResponse = chatResponse.data.response
      updateState('speaking')
      onAIResponse?.(aiResponse)
      
      // Simulate speaking duration based on response length
      const speakingDuration = Math.max(2000, aiResponse.length * 50) // ~50ms per character
      setTimeout(() => {
        updateState('idle')
      }, speakingDuration)
      
    } catch (error) {
      console.error("Audio processing error:", error)
      onError?.(`Failed to process audio: ${error}`)
      updateState('idle')
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      stopAudioLevelDetection()
    }
  }, [stopAudioLevelDetection])

  if (!voiceMode) {
    return (
      <Button
        onClick={onToggleVoiceMode}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Mic className="h-4 w-4" />
        Switch to Voice
      </Button>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        className={`${
          isRecording 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : currentState === 'processing'
            ? "bg-yellow-500 hover:bg-yellow-600"
            : currentState === 'speaking'
            ? "bg-green-500 hover:bg-green-600"
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
      
      <Button
        onClick={onToggleVoiceMode}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Switch to Text
      </Button>
    </div>
  )
}

// Enhanced hook for managing voice chat state with audio levels
export function useEnhancedVoiceChat(apiBaseUrl = "http://localhost:8000") {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
  const [audioLevel, setAudioLevel] = useState(0)

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

  const handleVoiceTranscription = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
  }

  const handleVoiceResponse = (response: string) => {
    setMessages(prev => [...prev, { role: 'ai', content: response }])
  }

  const clearMessages = () => setMessages([])
  const clearError = () => setError(null)

  return {
    messages,
    isLoading,
    error,
    voiceState,
    audioLevel,
    sendTextMessage,
    handleVoiceTranscription,
    handleVoiceResponse,
    setVoiceState,
    setAudioLevel,
    clearMessages,
    clearError
  }
}