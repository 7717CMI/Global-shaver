import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

interface InfoTooltipProps {
  content: string
  children: React.ReactNode
}

export function InfoTooltip({ content, children }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <>
          <div
            className={`absolute z-50 w-80 max-w-xs p-4 rounded-lg border-2 shadow-2xl pointer-events-none ${
              isDark
                ? 'bg-navy-card border-electric-blue text-white'
                : 'bg-white border-electric-blue text-gray-900'
            }`}
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
            }}
          >
            <div className="text-sm leading-relaxed">
              {content
                .replace(/\\n/g, '\n') // Handle literal \n strings
                .split('\n')
                .map((line, index) => {
                  const trimmed = line.trim()
                  if (!trimmed) return null
                  // Remove bullet if already present, we'll add our own
                  const text = trimmed.replace(/^[•\-\*]\s*/, '')
                  return (
                    <div key={index} className="flex items-start mb-2 last:mb-0">
                      <span className="mr-2.5 flex-shrink-0 text-base leading-none">•</span>
                      <span className="flex-1">{text}</span>
                    </div>
                  )
                })}
            </div>
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${isDark ? '#4FD1C5' : '#0075FF'}`,
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

