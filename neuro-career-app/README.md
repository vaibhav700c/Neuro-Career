# AI Career Assessment with Voice Integration

This project integrates your GenAI voice model with a Next.js frontend to create an interactive career assessment application. Users can chat with Bonita, an AI career counselor, using both voice and text.

## Features

- 🎤 **Voice Chat**: Record audio and get spoken responses from AI
- 💬 **Text Chat**: Type messages for text-based conversation  
- 🧠 **AI Career Counseling**: Powered by Gemini AI with career assessment prompts
- 🔊 **Text-to-Speech**: AI responses are spoken using ElevenLabs TTS
- 📝 **Speech-to-Text**: Voice input transcribed using AssemblyAI
- 🎨 **Modern UI**: Neon-themed interface with animations

## Architecture

```
Frontend (Next.js + React)
    ↕ HTTP API calls
Backend (FastAPI)
    ↕ External APIs 
External Services:
- AssemblyAI (Speech-to-Text)
- Google Gemini (AI Responses)  
- ElevenLabs (Text-to-Speech)
```

## Prerequisites

1. **API Keys**: You need to sign up and get API keys from:
   - [AssemblyAI](https://www.assemblyai.com/) - for speech transcription
   - [Google AI (Gemini)](https://ai.google.dev/) - for AI responses
   - [ElevenLabs](https://elevenlabs.io/) - for text-to-speech

2. **System Requirements**:
   - Python 3.8+ 
   - Node.js 16+
   - npm or yarn

## Quick Start

### 1. Setup Environment Variables

Copy your API keys to the environment file:

```bash
cp api/.env.example api/.env
```

Edit `api/.env` and add your real API keys:

```
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here  
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 2. Start the Application

The easiest way to start both the API and frontend:

```bash
./start.sh
```

This will:
- Set up the Python virtual environment (first time only)
- Install Python dependencies
- Start the FastAPI server on port 8000
- Start the Next.js frontend on port 3000

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Assessment Page**: http://localhost:3000/assessment

## Manual Setup (Alternative)

If you prefer to set up manually:

### Backend Setup

```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
npm install
npm run dev
```

## Usage

1. **Voice Chat**: 
   - Click "Start Recording" to begin voice input
   - Speak your message
   - Click "Stop Recording" 
   - The AI will transcribe, respond, and speak back

2. **Text Chat**:
   - Type in the text input field
   - Press Enter or click Send
   - Click the speaker icon on AI messages to hear them spoken

3. **Quick Responses**:
   - Use the quick response buttons for common answers

## API Endpoints

The FastAPI backend provides these endpoints:

- `POST /api/chat` - Send text message, get AI response
- `POST /api/transcribe` - Upload audio file for transcription
- `POST /api/voice-chat` - Complete voice workflow (upload audio → transcribe → AI response → TTS)
- `POST /api/text-to-speech` - Convert text to speech audio

## Customization

### AI Prompts

Edit the `CUSTOM_PROMPT` in `api/main.py` to customize the AI's behavior and questions.

### Voice Settings

Modify these constants in `api/main.py`:
- `ELEVEN_VOICE_ID` - ElevenLabs voice ID
- `ELEVEN_TTS_MODEL` - TTS model version

### UI Styling

The frontend uses Tailwind CSS. Key components:
- `components/voice-recorder.tsx` - Voice recording logic
- `app/assessment/page.tsx` - Main assessment interface
- `components/ui/` - Reusable UI components

## Troubleshooting

### Common Issues

1. **API Keys Not Working**:
   - Verify API keys are correct in `.env`
   - Check API key permissions and quotas

2. **Microphone Access Denied**:
   - Browser must have microphone permissions
   - Use HTTPS in production

3. **Audio Playback Issues**:
   - Check browser audio permissions
   - Try different browsers (Chrome recommended)

4. **Python Import Errors**:
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

### Logs

- **API Logs**: Check terminal where `python main.py` is running
- **Frontend Logs**: Check browser developer console
- **Network Errors**: Check browser Network tab in DevTools

## Development

### File Structure

```
neuro-career-app/
├── api/                 # FastAPI backend
│   ├── main.py         # API server and endpoints
│   ├── requirements.txt # Python dependencies  
│   └── .env            # Environment variables
├── app/                # Next.js app directory
│   └── assessment/     # Assessment page
├── components/         # React components
│   ├── voice-recorder.tsx # Voice recording component
│   └── ui/            # UI components
└── start.sh           # Startup script
```

### Adding Features

1. **New API Endpoints**: Add to `api/main.py`
2. **UI Components**: Add to `components/`
3. **Pages**: Add to `app/` directory
4. **Styling**: Use Tailwind classes

## Production Deployment

For production deployment:

1. **Environment Variables**: Set API keys as environment variables
2. **HTTPS**: Enable HTTPS for microphone access
3. **CORS**: Update CORS settings in `api/main.py`
4. **Build**: Run `npm run build` for production build

## License

This project integrates multiple services and APIs. Check individual service terms:
- AssemblyAI Terms
- Google AI Terms  
- ElevenLabs Terms