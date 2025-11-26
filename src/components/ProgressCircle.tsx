import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

interface ProgressCircleProps {
  progress: number
  size?: number
  strokeWidth?: number
}

export function ProgressCircle({ progress, size = 60, strokeWidth = 8 }: ProgressCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const radius = (size - strokeWidth) / 2
    const normalizedProgress = Math.min(Math.max(progress, 0), 1)

    ctx.clearRect(0, 0, size, size)

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = isDark ? '#1A2332' : '#E2E8F0'
    ctx.lineWidth = strokeWidth
    ctx.stroke()

    // Progress circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * normalizedProgress)
    ctx.strokeStyle = '#4FD1C5'
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Text
    ctx.fillStyle = isDark ? '#FFFFFF' : '#2D3748'
    ctx.font = 'bold 14px Inter'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(normalizedProgress * 100)}%`, centerX, centerY)
  }, [progress, size, strokeWidth, isDark])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="transform -rotate-90"
    />
  )
}

