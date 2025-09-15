"use client"

import { useEffect, useRef } from "react"

export default function ShaderGradientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGradient = () => {
      const { width, height } = canvas
      
      // Create gradient based on ShaderGradient config
      const gradient = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      )
      
      // Colors from the config: #b10000 (dark red), #000000 (black), #a7a328 (yellow-green)
      gradient.addColorStop(0, "#b10000") // Dark red center
      gradient.addColorStop(0.3, "#000000") // Black transition
      gradient.addColorStop(0.7, "#000000") // Black middle
      gradient.addColorStop(1, "#a7a328") // Yellow-green edges

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add noise effect (simplified version of the shader noise)
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width
        const y = Math.floor((i / 4) / width)
        
        // Simple noise function
        const noise = Math.sin(x * 0.01 + time * 0.3) * Math.cos(y * 0.01 + time * 0.2) * 0.1
        
        // Apply noise to RGB channels
        data[i] = Math.max(0, Math.min(255, data[i] + noise * 50))     // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 30)) // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 20)) // Blue
      }
      
      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      time += 0.016 // ~60fps
      drawGradient()
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ 
        background: "linear-gradient(135deg, #b10000 0%, #000000 50%, #a7a328 100%)",
        opacity: 0.8
      }}
    />
  )
}
