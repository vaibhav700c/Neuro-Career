from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import uvicorn
import os
import tempfile
import soundfile as sf
import numpy as np
from dotenv import load_dotenv
import google.generativeai as genai
import assemblyai as aai
from elevenlabs import ElevenLabs
import io

# Load environment variables
ENV_PATH = "/Users/webov/Desktop/Projects/GenAI/neuro-career-be             /.env"
load_dotenv(dotenv_path=ENV_PATH)

ASSEMBLYAI_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
ELEVEN_KEY = os.getenv("ELEVENLABS_API_KEY")

if not (ASSEMBLYAI_KEY and GEMINI_KEY and ELEVEN_KEY):
    raise RuntimeError("Missing API keys in .env (ASSEMBLYAI_API_KEY, GEMINI_API_KEY, ELEVENLABS_API_KEY)")

# Configure APIs
aai.settings.api_key = ASSEMBLYAI_KEY
genai.configure(api_key=GEMINI_KEY)
eleven_client = ElevenLabs(api_key=ELEVEN_KEY)

# FastAPI app
app = FastAPI(title="AI Career Assessment API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class TTSRequest(BaseModel):
    message: str

# AI Assistant Class (adapted from your original app1.py)
class AI_Assistant:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.system_prompt = """
You are Bonita, an AI career counselor specializing in helping people explore career paths that match their interests and skills. Your role is to:

1. Conduct friendly, conversational career assessments
2. Ask relevant questions about interests, skills, education, and goals
3. Provide personalized career recommendations
4. Offer guidance on educational pathways and skill development
5. Share insights about job market trends and opportunities

Keep your responses conversational, encouraging, and practical. Ask one question at a time to gather information gradually. Be supportive and help users discover careers they might not have considered.

Always maintain a warm, professional tone and show genuine interest in helping the user find their ideal career path.
"""

    def get_response(self, user_input: str) -> str:
        try:
            full_prompt = f"{self.system_prompt}\n\nStudent says: \"{user_input}\"\n\nBot Reply:"
            
            response = self.model.generate_content(full_prompt)
            
            if response and response.text:
                return response.text.strip()
            else:
                return "I'm here to help with your career exploration. Could you tell me a bit about yourself?"
                
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I'm having trouble responding right now. Could you please try again?"

# Initialize AI Assistant
assistant = AI_Assistant()

@app.get("/")
async def root():
    return {"message": "AI Career Assessment API is running!"}

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe uploaded audio file using AssemblyAI"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Read the uploaded file
        audio_data = await file.read()
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(audio_data)
            temp_file_path = temp_file.name
        
        try:
            # Transcribe using AssemblyAI
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(temp_file_path)
            
            if transcript.status == aai.TranscriptStatus.error:
                raise HTTPException(status_code=500, detail=f"Transcription failed: {transcript.error}")
            
            transcription_text = transcript.text or ""
            
            if not transcription_text.strip():
                transcription_text = "No speech detected in the audio."
            
            return {"transcription": transcription_text}
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        print(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Get AI response for user message"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        response = assistant.get_response(request.message)
        return {"response": response}
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/api/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using ElevenLabs"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Generate speech using ElevenLabs (updated API)
        audio = eleven_client.text_to_speech.convert(
            voice_id="pNInz6obpgDQGcFmaJgB",  # Rachel voice
            text=request.message,
            model_id="eleven_turbo_v2"
        )
        
        # Collect audio chunks into bytes
        audio_chunks = []
        for chunk in audio:
            if chunk:
                audio_chunks.append(chunk)
        
        # Combine all chunks
        audio_bytes = b"".join(audio_chunks)
        
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"}
        )
        
    except Exception as e:
        print(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")

if __name__ == "__main__":
    print("Starting AI Career Assessment FastAPI server...")
    print("Available endpoints:")
    print("  GET  / - Health check")
    print("  POST /api/transcribe - Audio transcription")
    print("  POST /api/chat - AI chat responses")
    print("  POST /api/text-to-speech - Text-to-speech conversion")
    print("\nServer running at: http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)