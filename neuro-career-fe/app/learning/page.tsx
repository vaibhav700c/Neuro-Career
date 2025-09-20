"use client"
import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { 
  Code, Database, Globe, Smartphone, Users, Trophy, 
  PlayCircle, BookOpen, Clock, CheckCircle, Star,
  Monitor, Server, Cpu, GitBranch, TestTube, Shield
} from "lucide-react"

const courses = [
  { 
    title: "JavaScript Fundamentals", 
    provider: "Tech Academy", 
    duration: "6 weeks",
    level: "Beginner",
    progress: 75,
    icon: Code,
    color: "text-yellow-400",
    description: "Master the basics of JavaScript programming"
  },
  { 
    title: "React Development", 
    provider: "Frontend Masters", 
    duration: "8 weeks",
    level: "Intermediate",
    progress: 45,
    icon: Monitor,
    color: "text-blue-400",
    description: "Build modern user interfaces with React"
  },
  { 
    title: "Node.js Backend", 
    provider: "Backend School", 
    duration: "10 weeks",
    level: "Intermediate",
    progress: 20,
    icon: Server,
    color: "text-green-400",
    description: "Create scalable server-side applications"
  },
  { 
    title: "Database Design", 
    provider: "Data University", 
    duration: "5 weeks",
    level: "Beginner",
    progress: 90,
    icon: Database,
    color: "text-purple-400",
    description: "Learn SQL and database optimization"
  },
  { 
    title: "DevOps Essentials", 
    provider: "Cloud Academy", 
    duration: "7 weeks",
    level: "Advanced",
    progress: 10,
    icon: Cpu,
    color: "text-cyan-400",
    description: "Master deployment and infrastructure"
  },
  { 
    title: "Testing & QA", 
    provider: "Quality Institute", 
    duration: "4 weeks",
    level: "Intermediate",
    progress: 60,
    icon: TestTube,
    color: "text-red-400",
    description: "Write comprehensive tests for your code"
  },
]

const mentors = [
  { name: "Sarah Chen", role: "Senior Software Engineer @ Google", specialty: "Frontend Development", rating: 4.9 },
  { name: "Marcus Johnson", role: "Tech Lead @ Microsoft", specialty: "Backend Systems", rating: 4.8 },
  { name: "Elena Rodriguez", role: "Principal Engineer @ Netflix", specialty: "Distributed Systems", rating: 5.0 },
  { name: "David Kim", role: "Staff Engineer @ Uber", specialty: "Mobile Development", rating: 4.7 },
  { name: "Amanda Foster", role: "Engineering Manager @ Spotify", specialty: "Team Leadership", rating: 4.9 },
]

const certifications = [
  { name: "AWS Certified Developer", progress: 80, icon: Shield },
  { name: "Google Cloud Professional", progress: 45, icon: Globe },
  { name: "React Developer Certified", progress: 90, icon: Code },
  { name: "Node.js Expert", progress: 60, icon: Server },
  { name: "Docker & Kubernetes", progress: 30, icon: Cpu },
  { name: "Agile Practitioner", progress: 75, icon: Users },
]

export default function LearningPage() {
  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader 
        title="Software Engineering Learning Path" 
        subtitle="Personalized courses, expert mentorship, and industry certifications to advance your career."
      />

      {/* Recommended Courses */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-400" />
          Recommended Courses
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gray-800 ${course.color}`}>
                    <course.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{course.title}</h4>
                    <p className="text-sm text-gray-400">{course.provider}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{course.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-blue-400">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <Button 
                  size="sm" 
                  className={`w-full ${course.progress > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {course.progress > 0 ? (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continue
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Course
                    </>
                  )}
                </Button>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expert Mentorship */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Users className="h-6 w-6 text-green-400" />
          Expert Mentorship
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{mentor.name}</h4>
                    <p className="text-sm text-gray-400">{mentor.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-yellow-400">{mentor.rating}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {mentor.specialty}
                  </Badge>
                </div>

                <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
                  <Users className="mr-2 h-4 w-4" />
                  Request Mentorship
                </Button>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Industry Certifications */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Industry Certifications
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 text-center">
                <div className="mb-4">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 ${cert.progress >= 80 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    <cert.icon className="h-8 w-8" />
                  </div>
                </div>
                
                <h4 className="font-semibold text-white mb-2">{cert.name}</h4>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-blue-400">{cert.progress}%</span>
                  </div>
                  <Progress value={cert.progress} className="h-2" />
                </div>

                {cert.progress >= 80 && (
                  <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready for Exam
                  </Badge>
                )}

                <Button 
                  size="sm" 
                  className={`w-full ${cert.progress >= 80 ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {cert.progress >= 80 ? 'Take Exam' : 'Continue Prep'}
                </Button>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
