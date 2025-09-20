"use client"
import dynamic from "next/dynamic"
import { SectionHeader } from "@/components/section-header"
import { NeonCard } from "@/components/neon-card"
import { motion } from "framer-motion"
import { Shield, Lock, Cpu, Brain, Headphones, Target, Code, BarChart3, Palette, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

const VRPreview = dynamic(() => import("@/components/vr-preview").then((m) => m.VRPreview), { ssr: false })

const steps = [
  { 
    icon: Target, 
    title: "Assessment", 
    desc: "Take our comprehensive career assessment to identify your strengths, interests, and aptitudes.",
    color: "text-blue-400"
  },
  { 
    icon: Brain, 
    title: "AI Analysis", 
    desc: "Our AI analyzes your responses and recommends the best career matches for your profile.",
    color: "text-purple-400"
  },
  { 
    icon: Headphones, 
    title: "VR Simulation", 
    desc: "Experience realistic workplace scenarios in VR for recommended professions.",
    color: "text-cyan-400"
  },
  { 
    icon: BarChart3, 
    title: "Performance Analysis", 
    desc: "Get detailed insights about your performance in different professional scenarios.",
    color: "text-green-400"
  },
  { 
    icon: Sparkles, 
    title: "Personalized Learning", 
    desc: "Access curated learning paths to develop skills for your chosen career direction.",
    color: "text-orange-400"
  },
]

const careerPaths = [
  { icon: Code, title: "Software Engineer", desc: "Build applications and systems", color: "text-blue-400" },
  { icon: BarChart3, title: "Data Scientist", desc: "Analyze data for insights", color: "text-green-400" },
  { icon: Palette, title: "UX Designer", desc: "Design user experiences", color: "text-purple-400" },
  { icon: Users, title: "Product Manager", desc: "Lead product development", color: "text-cyan-400" },
]

export default function HowItWorksPage() {
  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader 
        title="How it Works" 
        subtitle="Discover your ideal career through AI-powered assessment and immersive VR simulations"
      />
      
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience Your Future Career Before You Choose It
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform combines scientific assessment with cutting-edge VR technology 
            to help you make informed career decisions.
          </p>
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Our 5-Step Process</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 h-full relative overflow-hidden">
                <div className="absolute top-4 right-4 text-2xl font-bold text-white/10">
                  {i + 1}
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gray-800 ${step.color}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Career Paths Section */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Explore Career Paths</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {careerPaths.map((career, i) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard className="p-6 text-center hover:scale-105 transition-transform">
                <div className={`p-4 rounded-full bg-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${career.color}`}>
                  <career.icon className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-white mb-2">{career.title}</h4>
                <p className="text-gray-300 text-sm">{career.desc}</p>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VR Experience Section */}
      <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Immersive VR Experience</h3>
          <p className="text-gray-300 leading-relaxed">
            Step into realistic workplace environments and experience what it's really like 
            to work in different professions. Our VR simulations provide hands-on experience 
            that traditional career tests can't match.
          </p>
          <div className="space-y-3">
            {[
              "Realistic workplace scenarios",
              "Interactive task simulation", 
              "Real-time performance tracking",
              "Immediate feedback and insights"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <VRPreview />
          <p className="text-xs text-gray-400 text-center">
            Experience cutting-edge VR technology to explore your future career
          </p>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="text-center">
        <NeonCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">Privacy & Security First</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Your data is encrypted and secure. You maintain full control over your information 
            and can export or delete it anytime. We believe in transparency and your right to privacy.
          </p>
        </NeonCard>
      </div>
    </main>
  )
}
