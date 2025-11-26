import { Activity, PieChart as PieChartIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface StatBoxProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  progress?: string | number | null
  increase?: string
  onCircleClick?: () => void
}

export function StatBox({ title, subtitle, icon, progress, increase, onCircleClick }: StatBoxProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="w-full">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {icon && (
            <div className="mb-2 text-electric-blue dark:text-cyan-accent">
              {icon}
            </div>
          )}
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            {title}
          </h3>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm font-medium text-electric-blue dark:text-cyan-accent">
          {subtitle}
        </p>
        {increase && (
          <p className="text-sm font-medium text-success italic">
            {increase}
          </p>
        )}
      </div>
    </div>
  )
}

