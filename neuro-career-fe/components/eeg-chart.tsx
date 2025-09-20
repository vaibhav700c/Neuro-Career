"use client"
import { useEffect, useRef, useState } from "react"
import { Line, LineChart, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from "recharts"

type Point = { 
  t: number
  alpha: number
  beta: number
  gamma: number
  theta: number
  delta: number
}

export function EEGChart() {
  const [data, setData] = useState<Point[]>([])
  const tRef = useRef(0)

  useEffect(() => {
    const seed: Point[] = []
    for (let i = 0; i < 100; i++) {
      seed.push({
        t: i,
        // Alpha waves (8-13 Hz) - relaxed, focused states
        alpha: Math.sin(i * 0.2) * 15 + Math.sin(i * 0.4) * 8 + 50 + (Math.random() - 0.5) * 3,
        // Beta waves (13-30 Hz) - active thinking, concentration
        beta: Math.cos(i * 0.3) * 12 + Math.sin(i * 0.5) * 6 + 40 + (Math.random() - 0.5) * 3,
        // Gamma waves (30-100 Hz) - high-level cognitive processing
        gamma: Math.sin(i * 0.8) * 5 + Math.cos(i * 1.0) * 3 + 20 + (Math.random() - 0.5) * 2,
        // Theta waves (4-8 Hz) - creativity, intuition
        theta: Math.cos(i * 0.15) * 10 + Math.sin(i * 0.25) * 5 + 30 + (Math.random() - 0.5) * 3,
        // Delta waves (0.5-4 Hz) - deep sleep, healing
        delta: Math.sin(i * 0.05) * 8 + Math.cos(i * 0.1) * 4 + 15 + (Math.random() - 0.5) * 2,
      })
    }
    tRef.current = 100
    setData(seed)
    
    const id = setInterval(() => {
      tRef.current += 1
      setData((d) => {
        const t = tRef.current
        const next = {
          t: t,
          alpha: Math.sin(t * 0.2) * 15 + Math.sin(t * 0.4) * 8 + 50 + (Math.random() - 0.5) * 3,
          beta: Math.cos(t * 0.3) * 12 + Math.sin(t * 0.5) * 6 + 40 + (Math.random() - 0.5) * 3,
          gamma: Math.sin(t * 0.8) * 5 + Math.cos(t * 1.0) * 3 + 20 + (Math.random() - 0.5) * 2,
          theta: Math.cos(t * 0.15) * 10 + Math.sin(t * 0.25) * 5 + 30 + (Math.random() - 0.5) * 3,
          delta: Math.sin(t * 0.05) * 8 + Math.cos(t * 0.1) * 4 + 15 + (Math.random() - 0.5) * 2,
        }
        return [...d.slice(-99), next]
      })
    }, 500) // Much slower updates - 500ms instead of 100ms
    
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-80 w-full rounded-xl border border-white/20 bg-gray-900/50 p-4">
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-blue-400">Alpha (8-13Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-pink-500" />
          <span className="text-pink-400">Beta (13-30Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-purple-400">Gamma (30-100Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-500" />
          <span className="text-cyan-400">Theta (4-8Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-green-400">Delta (0.5-4Hz)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.2)" vertical={false} horizontal={true} />
          <XAxis 
            dataKey="t" 
            stroke="rgba(255,255,255,0.8)" 
            fontSize={10}
            axisLine={true}
            tickLine={true}
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.8)" 
            domain={[0, 80]} 
            fontSize={10}
            axisLine={true}
            tickLine={true}
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
            label={{ value: 'μV', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.8)' } }}
          />
          <Tooltip 
            contentStyle={{ 
              background: "rgba(0,0,0,0.9)", 
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
          <Line 
            type="monotone" 
            dataKey="alpha" 
            stroke="#3B82F6" 
            dot={false} 
            strokeWidth={3}
            strokeOpacity={1}
            name="Alpha"
          />
          <Line 
            type="monotone" 
            dataKey="beta" 
            stroke="#EC4899" 
            dot={false} 
            strokeWidth={3}
            strokeOpacity={1}
            name="Beta"
          />
          <Line 
            type="monotone" 
            dataKey="gamma" 
            stroke="#A855F7" 
            dot={false} 
            strokeWidth={2.5}
            strokeOpacity={1}
            name="Gamma"
          />
          <Line 
            type="monotone" 
            dataKey="theta" 
            stroke="#06B6D4" 
            dot={false} 
            strokeWidth={2.5}
            strokeOpacity={1}
            name="Theta"
          />
          <Line 
            type="monotone" 
            dataKey="delta" 
            stroke="#10B981" 
            dot={false} 
            strokeWidth={2}
            strokeOpacity={1}
            name="Delta"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
