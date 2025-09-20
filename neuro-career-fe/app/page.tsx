"use client"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { LiveCounter } from "@/components/live-counter"
import { Brain, Mic, PlayCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ParticleField } from "@/components/particle-field"
import { NeonButton } from "@/components/neon-button"
import { NeonCard } from "@/components/neon-card"
import { InteractiveBrainParticles } from "@/components/interactive-brain-particles"

// Keep the old brain canvas as a fallback (or remove entirely if not needed)
const NeuralBrainCanvas = dynamic(() => import("@/components/neural-brain-canvas").then((m) => m.NeuralBrainCanvas), {
  ssr: false,
})

export default function HomePage() {
  return (
    <main className="dark relative mx-auto max-w-7xl px-4 py-12 md:py-20">
      <ParticleField />

      {/* Hero Section */}
      <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm font-medium text-blue-300">
              <Brain className="w-4 h-4" />
              Next-Gen Career Intelligence
            </div>
            
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            
            <p className="max-w-2xl text-xl text-white/80 leading-relaxed">
              Experience revolutionary career assessments powered by AI, VR simulations, and real-time EEG insights. 
              Find your ideal career path through cutting-edge neurotechnology.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <NeonButton asChild glow ripple className="text-lg px-8 py-4">
              <Link href="/assessment">
                <Mic className="mr-3 h-5 w-5" />
                Start AI Assessment
              </Link>
            </NeonButton>
            <NeonButton 
              asChild 
              variant="secondary" 
              className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/20 text-lg px-8 py-4" 
              ripple
            >
              <Link href="/simulation">
                <PlayCircle className="mr-3 h-5 w-5" />
                Try VR Demo
              </Link>
            </NeonButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <LiveCounter />
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            
            {/* Main card */}
            <NeonCard className="relative p-6 bg-gray-900/80 backdrop-blur">
              <InteractiveBrainParticles height={480} />
            </NeonCard>
          </div>

          {/* Feature indicators */}
          <motion.div 
            className="mt-6 grid grid-cols-3 gap-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { icon: Brain, label: "Neural Network", color: "text-blue-400" },
              { icon: Mic, label: "EEG Linked", color: "text-purple-400" },
              { icon: PlayCircle, label: "Real-time AI", color: "text-pink-400" }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition-all duration-300">
                  <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-sm font-medium text-white/90">{item.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="mt-24 lg:mt-32"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Revolutionary Assessment Technology
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Combining neuroscience, artificial intelligence, and virtual reality for unprecedented career insights
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Brain,
              title: "AI-Driven Analysis",
              description: "Advanced machine learning algorithms analyze your responses, cognitive patterns, and EEG data to create a comprehensive career profile.",
              color: "from-blue-500/20 to-cyan-500/20",
              iconColor: "text-blue-400"
            },
            {
              icon: PlayCircle,
              title: "VR Career Immersion",
              description: "Experience different careers in virtual reality environments while we measure your engagement, focus, and natural aptitude.",
              color: "from-purple-500/20 to-pink-500/20",
              iconColor: "text-purple-400"
            },
            {
              icon: Brain,
              title: "EEG Brain Insights",
              description: "Real-time brainwave monitoring provides objective data on your cognitive strengths and preferences across different career scenarios.",
              color: "from-pink-500/20 to-orange-500/20",
              iconColor: "text-pink-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
            >
              <NeonCard className={`p-8 h-full bg-gradient-to-br ${feature.color} hover:scale-105 transition-all duration-300 group`}>
                <div className="space-y-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-white/10 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-white/80 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* VR Teaser Section */}
      <motion.section 
        className="mt-24 lg:mt-32"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <NeonCard className="p-0 overflow-hidden bg-gradient-to-br from-gray-900/50 to-blue-900/30">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 lg:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 text-sm font-medium text-pink-300">
                <PlayCircle className="w-4 h-4" />
                VR Experience Preview
              </div>
              
              <h3 className="text-3xl font-bold text-white">
                Immersive Career Simulations
              </h3>
              
              <p className="text-lg text-white/80 leading-relaxed">
                Step into realistic career environments and see how your brain responds. Our VR simulations provide 
                unprecedented insights into your natural preferences and aptitudes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Link href="/how-it-works">
                    Learn How It Works
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Link href="/simulation">
                    Try Demo Now
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-blue-900/40 to-purple-900/40">
              <img 
                src="/vr-career-teaser.jpg" 
                alt="VR career simulation preview" 
                className="h-full w-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="rounded-full bg-white/10 backdrop-blur hover:bg-white/20 border border-white/30"
                  >
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Play Experience
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </NeonCard>
      </motion.section>
    </main>
  )
}
