# 🧠 Neuro Career Assessment Platform

An AI-powered career assessment platform that combines neuroscience-inspired visualization with advanced AI to help users discover their ideal career paths through interactive simulations and assessments.

## 🌟 Features

- **AI-Powered Career Assessment**: Intelligent chatbot with text-to-speech capabilities
- **Interactive 3D Brain Visualization**: Stunning particle-based brain model with real-time interactions
- **Immersive Career Simulations**: Experience "a day in the life" of different professions
- **Real-time Voice Processing**: Advanced voice recording and transcription
- **Responsive Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS
- **Production Ready**: Optimized build with comprehensive error handling

## 🏗️ Project Structure

```
neuro-career-assessment/
├── 📁 neuro-career-fe/          # Frontend (Next.js App)
│   ├── app/                     # Next.js app directory
│   ├── components/              # Reusable React components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   └── public/                  # Static assets
│
├── 📁 neuro-career-be/          # Backend (Python API)
│   ├── app1.py                  # Main AI assistant logic
│   ├── fastapi_server.py        # FastAPI server
│   ├── .env                     # Environment variables (protected)
│   └── .gitignore               # Backend-specific ignores
│
├── .gitignore                   # Project-wide git ignores
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **pnpm**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/neuro-career-assessment.git
cd neuro-career-assessment
```

### 2. Frontend Setup (neuro-career-fe)

```bash
cd neuro-career-fe
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup (neuro-career-be)

```bash
cd neuro-career-be

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Run the server
python fastapi_server.py
```

The backend API will be available at `http://localhost:8000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `neuro-career-be` directory:

```env
# AI APIs
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_key_here

# Optional: Database and other services
DATABASE_URL=your_database_url_here
```

### API Keys Required

- **OpenAI/Gemini**: For AI conversation and career assessment
- **ElevenLabs**: For high-quality text-to-speech
- **AssemblyAI**: For voice transcription

## 🎨 Tech Stack

### Frontend (neuro-career-fe)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI
- **3D Graphics**: Three.js for brain visualization
- **Animations**: Framer Motion
- **State Management**: React hooks

### Backend (neuro-career-be)
- **Framework**: FastAPI
- **Language**: Python
- **AI/ML**: Google Gemini AI, OpenAI
- **Audio Processing**: ElevenLabs TTS, AssemblyAI STT
- **Audio Handling**: sounddevice, soundfile
- **Environment**: python-dotenv

## 🎯 Key Features Deep Dive

### 🧠 3D Brain Visualization
- Interactive particle-based brain model
- Dynamic color gradients matching app theme
- Hover effects and animations
- Real-time rendering with Three.js

### 🤖 AI Career Assessment
- Intelligent conversation flow
- Personalized career recommendations
- Real-time voice interaction
- Multi-modal input (voice + text)

### 🎮 Career Simulations
- "Day in the life" scenarios
- Interactive workplace tasks
- Skills assessment through simulation
- Real-time feedback and progress tracking

## 📱 Responsive Design

The platform is fully responsive and works seamlessly across:
- 📱 Mobile devices
- 📟 Tablets
- 💻 Desktops
- 🖥️ Large screens

## 🔒 Security Features

- Environment variables protected with `.gitignore`
- API key security
- Input validation and sanitization
- CORS configuration
- Production-ready error handling

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd neuro-career-fe
npm run build
# Deploy to your preferred platform
```

### Backend Deployment (Railway/Heroku/AWS)

```bash
cd neuro-career-be
# Set up production environment variables
# Deploy using your preferred platform
```

## 🧪 Development

### Available Scripts (Frontend)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

### Available Scripts (Backend)

```bash
python app1.py              # Run AI assistant
python fastapi_server.py    # Run FastAPI server
pip freeze > requirements.txt  # Update dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** for amazing 3D capabilities
- **Next.js** for the robust React framework
- **ElevenLabs** for high-quality TTS
- **AssemblyAI** for reliable STT
- **Framer Motion** for beautiful animations

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation in each directory
- Review the code comments for implementation details

---

Made with ❤️ Vaibhav for the future of career discovery