"use client"
import dynamic from "next/dynamic"
import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { 
  Code, Terminal, Database, Globe, Smartphone, Monitor, 
  Play, Pause, Square, Brain, Zap, Activity, Settings, 
  Trophy, CheckCircle, Target, Clock, Users, Lightbulb,
  Headphones, Coffee, Bug, GitBranch
} from "lucide-react"
import { useState, useEffect } from "react"

// Define the scenario type
interface Scenario {
  id: string
  title: string
  timeOfDay: string
  difficulty: string
  duration: string
  icon: any
  description: string
  skills: string[]
  completed: boolean
  color: string
}

const VRPreview = dynamic(() => import("@/components/vr-preview").then((m) => m.VRPreview), { ssr: false })
const EEGChart = dynamic(() => import("@/components/eeg-chart").then((m) => m.EEGChart), { ssr: false })
const WaveformVisualizer = dynamic(() => import("@/components/waveform-visualizer").then((m) => m.WaveformVisualizer), { ssr: false })

export default function SimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationTime, setSimulationTime] = useState(0)
  const [currentTask, setCurrentTask] = useState(1)
  const [totalTasks] = useState(5)
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSimulationRunning) {
      interval = setInterval(() => {
        setSimulationTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isSimulationRunning])

  const startSimulation = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    setIsSimulationRunning(true)
    setSimulationTime(0)
    setCurrentTask(1)
  }

  const stopSimulation = () => {
    setIsSimulationRunning(false)
    setSelectedScenario(null)
    setSimulationTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isSimulationRunning && selectedScenario) {
    return (
      <main className="dark mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Simulation Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <div className="relative">
              <Code className="h-6 w-6 text-blue-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="text-lg font-medium text-blue-400">
              Simulation Active - Active Session
            </span>
          </div>
        </div>

        {/* Progress & Timer */}
        <div className="grid gap-6 md:grid-cols-3">
          <NeonCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Session Time</span>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatTime(simulationTime)}</div>
            <div className="text-xs text-gray-400 mt-2">Real-time tracking</div>
          </NeonCard>
          
          <NeonCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Task Progress</span>
              <Target className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{currentTask}/{totalTasks}</div>
            <Progress value={(currentTask / totalTasks) * 100} className="mt-3 h-3" />
            <div className="text-xs text-gray-400 mt-2">
              {Math.round((currentTask / totalTasks) * 100)}% complete
            </div>
          </NeonCard>
          
          <NeonCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Focus Level</span>
              <Brain className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              {Math.floor(85 + Math.sin(Date.now() * 0.001) * 10)}%
            </div>
            <div className="text-xs text-gray-400 mt-2">Optimal range</div>
          </NeonCard>
        </div>

        {/* VR Environment & EEG Data */}
        <div className="grid gap-8 lg:grid-cols-2">
          <NeonCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">VR Development Environment</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="mb-6">
              <VRPreview />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Code Lines</div>
                <div className="text-lg font-semibold text-blue-400">847</div>
                <div className="text-xs text-green-400 mt-1">+23 today</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Tests Passed</div>
                <div className="text-lg font-semibold text-green-400">12/15</div>
                <div className="text-xs text-yellow-400 mt-1">3 pending</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Bugs Fixed</div>
                <div className="text-lg font-semibold text-purple-400">3</div>
                <div className="text-xs text-gray-400 mt-1">This session</div>
              </div>
            </div>
          </NeonCard>

          <NeonCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Live EEG Monitoring</h3>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Brain className="h-3 w-3 mr-1" />
                Recording
              </Badge>
            </div>
            <div className="mb-6">
              <EEGChart />
            </div>
            <div className="grid gap-4 grid-cols-3">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-400 mb-1">Focus</div>
                <div className="text-xl font-semibold text-blue-400">
                  {Math.floor(85 + Math.sin(Date.now() * 0.001) * 10)}
                </div>
                <div className="text-xs text-green-400 mt-1">High</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-400 mb-1">Stress</div>
                <div className="text-xl font-semibold text-red-400">
                  {Math.floor(25 + Math.cos(Date.now() * 0.0008) * 8)}
                </div>
                <div className="text-xs text-green-400 mt-1">Low</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-400 mb-1">Flow</div>
                <div className="text-xl font-semibold text-green-400">
                  {Math.floor(80 + Math.sin(Date.now() * 0.0012) * 12)}
                </div>
                <div className="text-xs text-blue-400 mt-1">Optimal</div>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Neural Activity & Performance */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NeonCard className="p-8">
              <div className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                <Activity className="h-5 w-5 text-green-400" />
                Real-time Neural Activity
              </div>
              <div className="mb-6">
                <WaveformVisualizer 
                  isActive={true}
                  frequency={1.2}
                  amplitude={0.8}
                  showFrequencyBands={true}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Alpha Waves</div>
                  <div className="text-sm font-semibold text-blue-400">8-12 Hz</div>
                  <div className="text-xs text-green-400 mt-1">Active</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Beta Waves</div>
                  <div className="text-sm font-semibold text-green-400">13-30 Hz</div>
                  <div className="text-xs text-green-400 mt-1">Strong</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Gamma Waves</div>
                  <div className="text-sm font-semibold text-purple-400">30+ Hz</div>
                  <div className="text-xs text-yellow-400 mt-1">Normal</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Theta Waves</div>
                  <div className="text-sm font-semibold text-yellow-400">4-8 Hz</div>
                  <div className="text-xs text-gray-400 mt-1">Baseline</div>
                </div>
              </div>
            </NeonCard>
          </div>

          <div>
            <NeonCard className="p-8">
              <div className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Performance Metrics
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Code Quality</span>
                    <span className="text-lg font-bold text-green-400">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="text-xs text-green-400 mt-1">Excellent</div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Problem Solving</span>
                    <span className="text-lg font-bold text-blue-400">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="text-xs text-blue-400 mt-1">Very Good</div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Communication</span>
                    <span className="text-lg font-bold text-purple-400">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <div className="text-xs text-purple-400 mt-1">Good</div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Learning Speed</span>
                    <span className="text-lg font-bold text-cyan-400">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <div className="text-xs text-cyan-400 mt-1">Outstanding</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Overall Performance</div>
                <div className="text-2xl font-bold text-blue-400">A+ Grade</div>
                <div className="text-xs text-gray-400">Above industry average</div>
              </div>
            </NeonCard>
          </div>
        </div>

        {/* Current Task */}
        <NeonCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Current Task</h3>
            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setCurrentTask(prev => Math.min(prev + 1, totalTasks))}
                className="border-blue-500/50 text-blue-400"
              >
                Next Task
              </Button>
              <Button 
                size="sm" 
                onClick={stopSimulation}
                className="bg-red-500 hover:bg-red-600"
              >
                <Square className="mr-2 h-4 w-4" />
                End Session
              </Button>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6">
            <p className="text-gray-300">
              {currentTask === 1 && "Set up the development environment and familiarize yourself with the codebase structure."}
              {currentTask === 2 && "Implement the core functionality according to the specifications provided."}
              {currentTask === 3 && "Write comprehensive unit tests to ensure code reliability."}
              {currentTask === 4 && "Debug and fix any issues found during testing phase."}
              {currentTask === 5 && "Code review and optimization for production deployment."}
            </p>
          </div>
        </NeonCard>
      </main>
    )
  }

  const dayInLifeScenarios = [
    {
      id: "morning-standup",
      title: "9:00 AM - Daily Standup",
      timeOfDay: "Morning",
      difficulty: "Beginner",
      duration: "8 min",
      icon: Users,
      description: "Join the daily standup meeting, share progress, discuss blockers, and plan your day",
      skills: ["Communication", "Team Collaboration", "Project Planning"],
      completed: true,
      color: "text-green-400"
    },
    {
      id: "feature-development",
      title: "9:30 AM - Build User Dashboard",
      timeOfDay: "Morning",
      difficulty: "Advanced",
      duration: "45 min",
      icon: Code,
      description: "Develop a new user dashboard feature with React components and API integration",
      skills: ["React", "TypeScript", "Frontend Development"],
      completed: false,
      color: "text-blue-400"
    }
  ]

  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader 
        title="A Day in the Life of a Software Engineer" 
        subtitle="Experience realistic workplace scenarios and tasks throughout a typical workday"
      />

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-16">
        <NeonCard className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">8</div>
          <div className="text-sm text-gray-400">Daily Activities</div>
        </NeonCard>
        <NeonCard className="p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">1</div>
          <div className="text-sm text-gray-400">Completed</div>
        </NeonCard>
        <NeonCard className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">6h</div>
          <div className="text-sm text-gray-400">Full Day Experience</div>
        </NeonCard>
        <NeonCard className="p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">Live</div>
          <div className="text-sm text-gray-400">EEG Monitoring</div>
        </NeonCard>
      </div>

      {/* VR Setup */}
      <div className="grid gap-8 lg:grid-cols-3 mb-16">
        <NeonCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Headphones className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">VR Setup</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Headset Status</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Controllers</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Both Active</span>
              </div>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              <Settings className="mr-2 h-4 w-4" />
              Calibrate VR
            </Button>
          </div>
        </NeonCard>

        <div className="lg:col-span-2">
          <NeonCard className="p-8">
            <h3 className="text-lg font-semibold text-white mb-6">Development Environment Preview</h3>
            <VRPreview />
            <div className="mt-6 text-sm text-gray-400 text-center">
              Interactive coding environment with real IDE experience
            </div>
          </NeonCard>
        </div>
      </div>

      {/* Daily Timeline Scenarios */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-400" />
          Your Developer Day Timeline
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {dayInLifeScenarios.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className={`p-8 hover:scale-105 transition-transform h-full ${scenario.completed ? 'bg-green-500/5 border-green-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-lg bg-gray-800 ${scenario.color}`}>
                      <scenario.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{scenario.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400">
                          {scenario.timeOfDay}
                        </Badge>
                        <span className="text-xs text-gray-400">{scenario.duration}</span>
                      </div>
                    </div>
                  </div>
                  {scenario.completed && (
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{scenario.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Difficulty:</span>
                    <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                      {scenario.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-3">Skills Developed:</div>
                  <div className="flex flex-wrap gap-2">
                    {scenario.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs bg-gray-700/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => startSimulation(scenario)}
                  disabled={scenario.completed}
                  variant={scenario.completed ? "outline" : "default"}
                >
                  {scenario.completed ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Activity
                    </>
                  )}
                </Button>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}