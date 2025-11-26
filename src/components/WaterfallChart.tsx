import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatWithCommas } from '../utils/dataGenerator'

interface WaterfallChartProps {
  data: Array<{
    year: string
    baseValue?: number
    incrementalValue?: number
    totalValue?: number
    isBase?: boolean
    isTotal?: boolean
  }>
  xAxisLabel?: string
  yAxisLabel?: string
  incrementalOpportunity?: number
}

export function WaterfallChart({ 
  data, 
  xAxisLabel = 'Year', 
  yAxisLabel = 'Market Value (US$ Mn)',
  incrementalOpportunity
}: WaterfallChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Transform data for waterfall chart
  // Each bar builds on the previous cumulative value
  let previousCumulative = 0
  const chartData = data.map((item, index) => {
    const isBase = item.isBase || false
    const isTotal = item.isTotal || false
    
    let basePortion = 0
    let incrementalPortion = 0
    let cumulativeValue = 0
    
    if (isBase) {
      // First bar: only base value, no incremental
      basePortion = item.baseValue || item.totalValue || 0
      incrementalPortion = 0
      cumulativeValue = basePortion
      previousCumulative = cumulativeValue
    } else if (isTotal) {
      // Last bar: shows total cumulative, but we'll calculate incremental from previous
      cumulativeValue = item.totalValue || 0
      basePortion = previousCumulative
      incrementalPortion = cumulativeValue - previousCumulative
    } else {
      // Middle bars: base portion = previous cumulative, incremental = new value
      let incrementalValue = item.incrementalValue
      if (incrementalValue === undefined) {
        // Calculate if not provided
        const currentTotal = item.totalValue || 0
        incrementalValue = currentTotal - previousCumulative
      }
      
      basePortion = previousCumulative
      incrementalPortion = incrementalValue || 0
      cumulativeValue = basePortion + incrementalPortion
      previousCumulative = cumulativeValue
    }
    
    return {
      year: item.year,
      basePortion,
      incrementalPortion,
      cumulativeValue,
      isBase,
      isTotal,
      incrementalValue: incrementalPortion,
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isBase = data.isBase
      
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">Year: {label}</p>
          {isBase ? (
            <p className="text-sm">
              <strong>Base Value:</strong> {formatWithCommas(data.cumulativeValue || 0, 1)} US$ Mn
            </p>
          ) : (
            <>
              <p className="text-sm">
                <strong>Base Value (from previous):</strong> {formatWithCommas(data.basePortion || 0, 1)} US$ Mn
              </p>
              <p className="text-sm">
                <strong>Incremental $ Opportunity Value:</strong> {formatWithCommas(data.incrementalValue || 0, 1)} US$ Mn
              </p>
              <p className="text-sm text-blue-400">
                <strong>Cumulative Value:</strong> {formatWithCommas(data.cumulativeValue || 0, 1)} US$ Mn
              </p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  // Two-tone blue colors
  const darkBlue = '#1E40AF' // Darker blue for base portion
  const lightBlue = '#60A5FA' // Lighter blue for incremental portion

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

      {/* Bold Title - Incremental $ Opportunity Analysis */}
      <div className="absolute top-4 left-0 right-0 z-20 text-center mb-4">
        <h3 className="text-2xl font-bold text-electric-blue dark:text-cyan-accent">
          Incremental $ Opportunity Analysis
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="100%" className="relative z-10">
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 70,
            right: 40,
            left: 80,
            bottom: 100,
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
              position: 'bottom',
              offset: 15,
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
            tickFormatter={(value) => formatWithCommas(value, 0)}
            width={90}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
            tickMargin={15}
            domain={[0, 'auto']}
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
          
          {/* Base portion bar (shows base value for first bar, previous cumulative for others) */}
          <Bar 
            dataKey="basePortion" 
            stackId="waterfall"
            radius={[0, 0, 0, 0]}
            name="Base Value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-base-${index}`} 
                fill={darkBlue}
              />
            ))}
          </Bar>
          
          {/* Incremental portion bar (0 for base bar, incremental value for others) */}
          <Bar 
            dataKey="incrementalPortion" 
            stackId="waterfall"
            radius={[0, 0, 0, 0]}
            name="Incremental Value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-incremental-${index}`} 
                fill={entry.isBase ? darkBlue : lightBlue}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
