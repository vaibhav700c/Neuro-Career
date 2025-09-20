"use client"
import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code, Brain, Target, Star, TrendingUp, CheckCircle, ArrowRight, Trophy, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"

const primaryRecommendation = {
  role: "Software Engineer",
  score: 95,
  tags: ["Problem Solving", "Logical Thinking", "Technical Aptitude", "Creativity"],
  description: "Your assessment reveals a strong aptitude for software engineering with excellent logical reasoning and problem-solving capabilities.",
  strengths: [
    "Exceptional analytical thinking",
    "Strong pattern recognition",
    "Creative problem-solving approach",
    "Technical curiosity and learning drive"
  ],
  nextSteps: [
    "Start with our immersive VR coding simulation",
    "Explore programming fundamentals course",
    "Build a portfolio project",
    "Connect with industry mentors"
  ],
  careerPaths: [
    { title: "Frontend Developer", match: "92%", timeframe: "6-12 months" },
    { title: "Backend Developer", match: "88%", timeframe: "8-14 months" },
    { title: "Full Stack Developer", match: "90%", timeframe: "12-18 months" },
    { title: "Mobile App Developer", match: "85%", timeframe: "10-16 months" }
  ]
}

const alternativeMatches = [
  { role: "Product Manager", score: 87, tags: ["Leadership", "Strategy", "Communication"], reason: "Strong analytical skills transfer well to product strategy" },
  { role: "Data Scientist", score: 83, tags: ["Analysis", "Mathematics", "Research"], reason: "Logical thinking patterns align with data analysis" },
  { role: "UX Designer", score: 79, tags: ["User Focus", "Creativity", "Problem Solving"], reason: "Creative problem-solving approach suits design thinking" },
]

const assessmentInsights = [
  { category: "Technical Aptitude", score: 94, color: "text-blue-400" },
  { category: "Problem Solving", score: 96, color: "text-green-400" },
  { category: "Logical Reasoning", score: 92, color: "text-purple-400" },
  { category: "Learning Agility", score: 89, color: "text-cyan-400" },
  { category: "Communication", score: 85, color: "text-orange-400" },
]

export default function AssessmentResultsPage() {
  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader
        title="Your Assessment Results"
        subtitle="Based on your responses, we've identified your ideal career path and alternative options"
      />

      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-6">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Top Career Match</span>
          </div>
        </div>

        <NeonCard className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Code className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{primaryRecommendation.role}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-semibold text-green-400">{primaryRecommendation.score}% Match</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{primaryRecommendation.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {primaryRecommendation.tags.map((tag) => (
                  <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/simulation">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start VR Simulation
                  </Button>
                </Link>
                <Link href="/learning">
                  <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Learning Path
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Your Key Strengths
                </h4>
                <div className="space-y-3">
                  {primaryRecommendation.strengths.map((strength, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-gray-300 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Recommended Next Steps
                </h4>
                <div className="space-y-3">
                  {primaryRecommendation.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                        {i + 1}
                      </div>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </NeonCard>
      </motion.div>

      {/* Career Paths within Software Engineering */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          Software Engineering Specializations
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {primaryRecommendation.careerPaths.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 hover:bg-blue-500/5 transition-colors h-full">
                <h4 className="font-semibold text-white mb-4">{path.title}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Match:</span>
                    <span className="text-sm font-semibold text-green-400">{path.match}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Timeline:</span>
                    <span className="text-sm text-blue-300">{path.timeframe}</span>
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Assessment Insights */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-400" />
          Your Assessment Breakdown
        </h3>
        <NeonCard className="p-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {assessmentInsights.map((insight, i) => (
              <motion.div
                key={insight.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{insight.category}</span>
                  <span className={`font-bold ${insight.color}`}>{insight.score}%</span>
                </div>
                <Progress value={insight.score} className="h-3" />
              </motion.div>
            ))}
          </div>
        </NeonCard>
      </div>

      {/* Alternative Career Options */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8">Alternative Career Options</h3>
        <p className="text-gray-300 mb-8">
          Based on your assessment, here are other careers that align with your strengths:
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {alternativeMatches.map((match, i) => (
            <motion.div
              key={match.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 hover:bg-gray-800/50 transition-colors h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-white">{match.role}</h4>
                    <span className="text-lg font-semibold text-blue-400">{match.score}%</span>
                  </div>
                  
                  <Progress value={match.score} className="h-3" />
                  
                  <p className="text-sm text-gray-300">{match.reason}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {match.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-700/50 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
