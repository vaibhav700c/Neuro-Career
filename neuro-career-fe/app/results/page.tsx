"use client"
import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  Download, Trophy, Target, Brain, Clock, Star, 
  TrendingUp, Code, Bug, Database, Globe, CheckCircle,
  Award, BarChart3, Lightbulb, Users, ArrowRight
} from "lucide-react"

const simulationResults = [
  {
    id: "code-review",
    title: "Code Review Session",
    completed: true,
    score: 88,
    duration: "8m 42s",
    icon: Code,
    color: "text-green-400",
    skills: [
      { name: "Code Quality Assessment", score: 90 },
      { name: "Communication", score: 85 },
      { name: "Attention to Detail", score: 92 }
    ],
    highlights: [
      "Identified all critical issues",
      "Provided constructive feedback",
      "Followed best practices"
    ]
  },
  {
    id: "debugging",
    title: "Debug Complex Application",
    completed: true,
    score: 92,
    duration: "12m 18s",
    icon: Bug,
    color: "text-red-400",
    skills: [
      { name: "Problem Solving", score: 95 },
      { name: "Logical Thinking", score: 90 },
      { name: "Debugging Skills", score: 88 }
    ],
    highlights: [
      "Found root cause quickly",
      "Systematic debugging approach",
      "Efficient solution implementation"
    ]
  },
  {
    id: "api-design",
    title: "API Architecture",
    completed: false,
    score: 0,
    duration: "0m",
    icon: Globe,
    color: "text-cyan-400",
    skills: [],
    highlights: []
  },
  {
    id: "database-optimization",
    title: "Database Performance",
    completed: false,
    score: 0,
    duration: "0m",
    icon: Database,
    color: "text-purple-400",
    skills: [],
    highlights: []
  }
]

const overallMetrics = [
  { name: "Problem Solving", score: 92, change: "+8", color: "text-blue-400" },
  { name: "Code Quality", score: 88, change: "+12", color: "text-green-400" },
  { name: "Communication", score: 85, change: "+5", color: "text-purple-400" },
  { name: "Debugging", score: 90, change: "+15", color: "text-red-400" },
  { name: "Technical Knowledge", score: 86, change: "+10", color: "text-cyan-400" },
  { name: "Learning Speed", score: 94, change: "+6", color: "text-orange-400" }
]

const achievements = [
  { title: "First Simulation", desc: "Completed your first VR coding scenario", icon: Trophy, unlocked: true },
  { title: "Bug Hunter", desc: "Successfully debugged a complex application", icon: Bug, unlocked: true },
  { title: "Code Reviewer", desc: "Provided quality code review feedback", icon: CheckCircle, unlocked: true },
  { title: "Full Stack Ready", desc: "Complete all simulation scenarios", icon: Award, unlocked: false },
  { title: "Performance Expert", desc: "Score 95%+ on any simulation", icon: Star, unlocked: false },
  { title: "Speed Coder", desc: "Complete any scenario under target time", icon: Clock, unlocked: false }
]

const careerFitAnalysis = {
  softwareEngineer: 94,
  frontend: 91,
  backend: 88,
  fullstack: 89,
  mobile: 85
}

export default function ResultsPage() {
  const completedSimulations = simulationResults.filter(sim => sim.completed)
  const totalScore = completedSimulations.reduce((acc, sim) => acc + sim.score, 0) / completedSimulations.length || 0
  const totalTime = completedSimulations.reduce((acc, sim) => {
    const [minutes, seconds] = sim.duration.split('m ')
    return acc + parseInt(minutes) + parseInt(seconds) / 60
  }, 0)

  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader 
        title="Your Simulation Results" 
        subtitle="Comprehensive analysis of your VR coding experience and performance metrics"
      />

      {/* Overview Stats */}
      <div className="mb-16">
        <div className="grid gap-6 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NeonCard className="p-8 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(totalScore)}%</div>
              <div className="text-sm text-gray-400">Overall Score</div>
            </NeonCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NeonCard className="p-8 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{completedSimulations.length}</div>
              <div className="text-sm text-gray-400">Simulations Completed</div>
            </NeonCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NeonCard className="p-8 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{Math.round(totalTime)}m</div>
              <div className="text-sm text-gray-400">Total Practice Time</div>
            </NeonCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NeonCard className="p-8 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-sm text-gray-400">Achievements Unlocked</div>
            </NeonCard>
          </motion.div>
        </div>
      </div>

      {/* Career Fit Analysis */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-400" />
          Software Engineering Career Fit
        </h3>
        <NeonCard className="p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Overall Compatibility</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Software Engineer</span>
                  <div className="flex items-center gap-3">
                    <Progress value={careerFitAnalysis.softwareEngineer} className="w-32 h-2" />
                    <span className="text-blue-400 font-bold w-12">{careerFitAnalysis.softwareEngineer}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Frontend Developer</span>
                  <div className="flex items-center gap-3">
                    <Progress value={careerFitAnalysis.frontend} className="w-32 h-2" />
                    <span className="text-green-400 font-bold w-12">{careerFitAnalysis.frontend}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backend Developer</span>
                  <div className="flex items-center gap-3">
                    <Progress value={careerFitAnalysis.backend} className="w-32 h-2" />
                    <span className="text-purple-400 font-bold w-12">{careerFitAnalysis.backend}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Full Stack Developer</span>
                  <div className="flex items-center gap-3">
                    <Progress value={careerFitAnalysis.fullstack} className="w-32 h-2" />
                    <span className="text-cyan-400 font-bold w-12">{careerFitAnalysis.fullstack}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Key Insights</h4>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Strong Problem Solver</span>
                  </div>
                  <p className="text-xs text-gray-300">Your debugging simulation showed excellent analytical thinking and systematic approach.</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Great Communicator</span>
                  </div>
                  <p className="text-xs text-gray-300">Code review performance indicates strong ability to provide clear, constructive feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Simulation Performance */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-green-400" />
          Simulation Performance
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {simulationResults.map((simulation, i) => (
            <motion.div
              key={simulation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className={`p-8 ${simulation.completed ? 'bg-green-500/5 border-green-500/30' : 'bg-gray-500/5 border-gray-500/30'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gray-800 ${simulation.color}`}>
                      <simulation.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{simulation.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        {simulation.completed ? (
                          <>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Completed</Badge>
                            <span className="text-sm text-gray-400">{simulation.duration}</span>
                          </>
                        ) : (
                          <Badge variant="outline" className="border-gray-500/50 text-gray-400">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {simulation.completed && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{simulation.score}%</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                  )}
                </div>

                {simulation.completed && (
                  <>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">Skills Assessed</h5>
                      <div className="space-y-2">
                        {simulation.skills.map((skill) => (
                          <div key={skill.name} className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={skill.score} className="w-20 h-2" />
                              <span className="text-xs text-blue-400 w-8">{skill.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Key Highlights</h5>
                      <div className="space-y-1">
                        {simulation.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-gray-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!simulation.completed && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400 mb-3">Try this simulation to see your results</p>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Start Simulation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overall Skill Progress */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-400" />
          Skill Development Progress
        </h3>
        <NeonCard className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {overallMetrics.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${metric.color}`}>{metric.score}%</span>
                    <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <Progress value={metric.score} className="h-2" />
                <div className="text-xs text-gray-400">
                  {metric.score >= 90 ? 'Expert Level' : 
                   metric.score >= 80 ? 'Advanced' :
                   metric.score >= 70 ? 'Intermediate' : 'Developing'}
                </div>
              </motion.div>
            ))}
          </div>
        </NeonCard>
      </div>

      {/* Achievements */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Achievements
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className={`p-6 ${achievement.unlocked ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-gray-500/5 border-gray-500/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-500'}`}>
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${achievement.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.desc}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="text-center">
        <NeonCard className="p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Export Your Results</h3>
          <p className="text-gray-300 mb-8">
            Share your achievements and progress with potential employers or save for your records.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.print()} className="bg-blue-500 hover:bg-blue-600">
              <Download className="mr-2 h-4 w-4" />
              Export PDF Report
            </Button>
            <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
              Share Results
            </Button>
          </div>
        </NeonCard>
      </div>
    </main>
  )
}
