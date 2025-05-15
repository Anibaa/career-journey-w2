"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  pulse: number
  pulseSpeed: number
}

export function EnhancedParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isMouseMovingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 150)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: getRandomColor(),
          alpha: Math.random() * 0.5 + 0.1,
          pulse: 0,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }

      particlesRef.current = particles
    }

    const getRandomColor = () => {
      const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    const drawParticles = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update pulse
        particle.pulse += particle.pulseSpeed
        if (particle.pulse > 1 || particle.pulse < 0) {
          particle.pulseSpeed *= -1
        }

        // Calculate distance from mouse if mouse is moving
        let distanceEffect = 1
        if (isMouseMovingRef.current) {
          const dx = particle.x - mousePositionRef.current.x
          const dy = particle.y - mousePositionRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            distanceEffect = distance / 100
          }
        }

        const size = particle.size * (1 + particle.pulse * 0.3) * distanceEffect
        const alpha = particle.alpha * (1 - particle.pulse * 0.3) * distanceEffect

        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      updateParticles()
      connectParticles()

      // Reset mouse movement flag after a delay
      if (isMouseMovingRef.current) {
        setTimeout(() => {
          isMouseMovingRef.current = false
        }, 100)
      }

      animationFrameRef.current = requestAnimationFrame(drawParticles)
    }

    const updateParticles = () => {
      if (!canvas) return

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) {
          particle.x = 0
        } else if (particle.x < 0) {
          particle.x = canvas.width
        }

        if (particle.y > canvas.height) {
          particle.y = 0
        } else if (particle.y < 0) {
          particle.y = canvas.height
        }
      })
    }

    const connectParticles = () => {
      if (!ctx) return

      const maxDistance = 120
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.globalAlpha = opacity * 0.2

            // Create gradient for line
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            gradient.addColorStop(0, particles[i].color)
            gradient.addColorStop(1, particles[j].color)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      isMouseMovingRef.current = true
    }

    resizeCanvas()
    createParticles()
    drawParticles()

    window.addEventListener("resize", () => {
      resizeCanvas()
      createParticles()
    })

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
