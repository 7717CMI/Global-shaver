import { useState } from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

interface YoYCAGRChartProps {
  data: Array<{
    year: string
    yoy: number
    cagr: number
    [key: string]: any
  }>
  xAxisLabel?: string
  yAxisLabel?: string
}

export function YoYCAGRChart({ 
  data, 
  xAxisLabel = 'Year', 
  yAxisLabel = 'Growth Rate (%)'
}: YoYCAGRChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [showCAGR, setShowCAGR] = useState(false)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">Year: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const dataKeys = showCAGR ? ['cagr'] : ['yoy']
  const colors = showCAGR ? ['#4ECDC4'] : ['#0075FF']

  return (
    <div className="relative w-full h-full">
      {/* Demo Data Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ opacity: 0.12 }}
      >
        <span 
          className="text-4xl font-bold text-gray-400 dark:text-gray-600 select-none"
          style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
        >
          Demo Data
        </span>
      </div>

      {/* Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`flex items-center gap-2 p-2 rounded-lg border ${
          isDark 
            ? 'bg-navy-card border-navy-light' 
            : 'bg-white border-gray-300'
        } shadow-md`}>
          <button
            onClick={() => setShowCAGR(false)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              !showCAGR
                ? 'bg-electric-blue text-white'
                : isDark
                  ? 'text-text-secondary-dark hover:text-text-primary-dark'
                  : 'text-text-secondary-light hover:text-text-primary-light'
            }`}
          >
            Y-o-Y
          </button>
          <button
            onClick={() => setShowCAGR(true)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              showCAGR
                ? 'bg-electric-blue text-white'
                : isDark
                  ? 'text-text-secondary-dark hover:text-text-primary-dark'
                  : 'text-text-secondary-light hover:text-text-primary-light'
            }`}
          >
            CAGR
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%" className="relative z-10">
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 40,
            left: 80,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
          <XAxis 
            dataKey="year"
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
            tickMargin={10}
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748'
              }
            }}
          />
          <YAxis 
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            width={90}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
            tickMargin={15}
            domain={['auto', 'auto']}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748',
                textAnchor: 'middle'
              }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: isDark ? '#E2E8F0' : '#2D3748'
            }}
            iconSize={12}
          />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={showCAGR ? 'CAGR (%)' : 'Y-o-Y Growth (%)'}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

