"use client"

import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  return (
    <main className="dark mx-auto max-w-7xl px-4 py-10 md:py-16">
      <SectionHeader 
        title="Profile & Achievements" 
        subtitle="Manage your learning journey, achievements, and career development progress."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <NeonCard className="p-8 mb-8">
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <img 
                  src="/placeholder-user.jpg" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-2 border-blue-500/50"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Alex Johnson</h3>
              <p className="text-blue-400 mb-2">Software Engineer</p>
              <p className="text-sm text-gray-400 mb-4">Passionate about creating innovative solutions and learning new technologies</p>
            </div>
          </NeonCard>

          {/* Quick Stats */}
          <NeonCard className="p-8">
            <h4 className="text-lg font-semibold text-white mb-6">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Simulations Completed</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Achievements Unlocked</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Overall Score</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">90%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Learning Streak</span>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">7 days</Badge>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Achievements */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Achievements</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <NeonCard className="p-8 bg-green-500/5 border-green-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-400 text-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">First Simulation</h4>
                    <p className="text-sm text-gray-300">Completed your first VR coding scenario</p>
                    <p className="text-xs text-blue-400 mt-2">Earned Sept 15, 2025</p>
                  </div>
                </div>
              </NeonCard>

              <NeonCard className="p-8 bg-green-500/5 border-green-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-400 text-2xl">
                    🐛
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Bug Hunter</h4>
                    <p className="text-sm text-gray-300">Successfully debugged a complex application</p>
                    <p className="text-xs text-blue-400 mt-2">Earned Sept 18, 2025</p>
                  </div>
                </div>
              </NeonCard>

              <NeonCard className="p-8 bg-green-500/5 border-green-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-400 text-2xl">
                    ✅
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Code Reviewer</h4>
                    <p className="text-sm text-gray-300">Provided quality code review feedback</p>
                    <p className="text-xs text-blue-400 mt-2">Earned Sept 19, 2025</p>
                  </div>
                </div>
              </NeonCard>

              <NeonCard className="p-8 bg-gray-500/5 border-gray-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg bg-gray-700 text-gray-500 text-2xl">
                    🖥️
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-500">Full Stack Ready</h4>
                    <p className="text-sm text-gray-600">Complete all simulation scenarios</p>
                  </div>
                </div>
              </NeonCard>
            </div>
          </div>

          {/* Skill Progress */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Skill Progress</h3>
            <NeonCard className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">JavaScript</span>
                      <Badge variant="outline" className="ml-2 text-xs border-purple-500/50 text-purple-400">
                        Frontend
                      </Badge>
                    </div>
                    <span className="text-blue-400 font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">React</span>
                      <Badge variant="outline" className="ml-2 text-xs border-purple-500/50 text-purple-400">
                        Frontend
                      </Badge>
                    </div>
                    <span className="text-blue-400 font-bold">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">Node.js</span>
                      <Badge variant="outline" className="ml-2 text-xs border-purple-500/50 text-purple-400">
                        Backend
                      </Badge>
                    </div>
                    <span className="text-blue-400 font-bold">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">Python</span>
                      <Badge variant="outline" className="ml-2 text-xs border-purple-500/50 text-purple-400">
                        Backend
                      </Badge>
                    </div>
                    <span className="text-blue-400 font-bold">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </div>
            </NeonCard>
          </div>

          {/* Privacy & Settings */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Privacy & Settings</h3>
            <NeonCard className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6">Data Sharing Preferences</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="eeg" className="text-white font-medium">EEG Data Sharing</Label>
                        <p className="text-sm text-gray-400">Allow sharing of brain activity data for research</p>
                      </div>
                      <Switch id="eeg" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="vr" className="text-white font-medium">VR Session Analytics</Label>
                        <p className="text-sm text-gray-400">Share VR session data to improve experience</p>
                      </div>
                      <Switch id="vr" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ai" className="text-white font-medium">AI Recommendations</Label>
                        <p className="text-sm text-gray-400">Receive personalized learning recommendations</p>
                      </div>
                      <Switch id="ai" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Save Preferences
                  </Button>
                  <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    Export Data
                  </Button>
                </div>
              </div>
            </NeonCard>
          </div>
        </div>
      </div>
    </main>
  )
}