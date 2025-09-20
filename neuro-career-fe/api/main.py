from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import tempfile
import io
from typing import List
from pydantic import BaseModel
import uvicorn

# Import your AI assistant
import sys
sys.path.append('/Users/webov/Desktop/Projects/GenAI/genai_model              ')

# We'll need to modify the imports and structure slightly
import google.generativeai as genai
import assemblyai as aai
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import soundfile as sf
import numpy as np

# Load environment variables
load_dotenv()  # This will look for .env in the current directory

# Configure APIs
ASSEMBLYAI_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
ELEVEN_KEY = os.getenv("ELEVENLABS_API_KEY")

if not (ASSEMBLYAI_KEY and GEMINI_KEY and ELEVEN_KEY):
    raise RuntimeError("Missing API keys in .env")

aai.settings.api_key = ASSEMBLYAI_KEY
genai.configure(api_key=GEMINI_KEY)
eleven_client = ElevenLabs(api_key=ELEVEN_KEY)

# Constants
ELEVEN_VOICE_ID = "pNInz6obpgDQGcFmaJgB"
ELEVEN_TTS_MODEL = "eleven_turbo_v2"

CUSTOM_PROMPT = """
You are a prototype career counsellor helping students narrow down the best career paths for them based on their aptitudes.
Do not start asking them questions until they say yes.
Ask the user the following questions all together in a conversational manner and collect their answers:
Age, School class, location, Interests, Skills, Constraints (parental preferences, time constraints), Values (helping others, creativity, money, work-life balance), Prior exploration (activity, description, duration, feedback)

You are a prototype: always suggest "software engineer" as the optimal career path.

Student says: "{user_input}"

Bot Reply:
"""

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    audio_url: str = None

# FastAPI app
app = FastAPI(title="AI Career Counselor API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

@app.get("/")
async def root():
    return {"message": "AI Career Counselor API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Send a text message to the AI and get a response
    """
    try:
        # Generate AI response
        full_prompt = CUSTOM_PROMPT.format(user_input=request.message)
        response = model.generate_content(full_prompt)
        ai_reply = response.text.strip() if hasattr(response, 'text') else "Sorry, I couldn't generate a response."
        
        return ChatResponse(response=ai_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe uploaded audio file using AssemblyAI
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        # Transcribe using AssemblyAI
        transcriber = aai.Transcriber()
        result = transcriber.transcribe(temp_path)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        if result.text:
            return {"transcription": result.text}
        else:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")

@app.post("/api/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    """
    Complete voice chat: transcribe audio, generate AI response, and return TTS audio
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        # Transcribe using AssemblyAI
        transcriber = aai.Transcriber()
        result = transcriber.transcribe(temp_path)
        
        # Clean up input temp file
        os.unlink(temp_path)
        
        if not result.text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
        
        user_message = result.text
        
        # Generate AI response
        full_prompt = CUSTOM_PROMPT.format(user_input=user_message)
        response = model.generate_content(full_prompt)
        ai_reply = response.text.strip() if hasattr(response, 'text') else "Sorry, I couldn't generate a response."
        
        # Generate TTS audio
        audio_iter = eleven_client.text_to_speech.convert(
            voice_id=ELEVEN_VOICE_ID,
            model_id=ELEVEN_TTS_MODEL,
            text=ai_reply
        )
        
        # Collect audio chunks
        audio_chunks = []
        for chunk in audio_iter:
            if chunk:
                audio_chunks.append(chunk)
        
        # Combine audio chunks
        audio_data = b''.join(audio_chunks)
        
        return {
            "transcription": user_message,
            "response": ai_reply,
            "audio_data": audio_data.hex()  # Convert to hex for JSON transport
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice chat error: {str(e)}")

@app.post("/api/text-to-speech")
async def text_to_speech(request: ChatRequest):
    """
    Convert text to speech using ElevenLabs
    """
    try:
        audio_iter = eleven_client.text_to_speech.convert(
            voice_id=ELEVEN_VOICE_ID,
            model_id=ELEVEN_TTS_MODEL,
            text=request.message
        )
        
        # Collect audio chunks
        audio_chunks = []
        for chunk in audio_iter:
            if chunk:
                audio_chunks.append(chunk)
        
        # Combine audio chunks
        audio_data = b''.join(audio_chunks)
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)