import { useMemo } from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber, formatWithCommas } from '../utils/dataGenerator'
import { getChartColors } from '../utils/chartColors'

interface SegmentGroupedBarChartProps {
  data: Array<Record<string, number | string>>
  segmentKeys: string[]
  xAxisLabel?: string
  yAxisLabel?: string
}

export function SegmentGroupedBarChart({ 
  data, 
  segmentKeys,
  xAxisLabel = 'Year', 
  yAxisLabel = 'Value' 
}: SegmentGroupedBarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0 || !segmentKeys || segmentKeys.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  const colors = useMemo(() => {
    return getChartColors(segmentKeys.length)
  }, [segmentKeys.length])

  const segmentColors: Record<string, string> = useMemo(() => {
    const colorMap: Record<string, string> = {}
    segmentKeys.forEach((key, index) => {
      colorMap[key] = colors[index % colors.length]
    })
    return colorMap
  }, [segmentKeys, colors])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // In grouped bar charts, payload contains all bars for that x-axis value
      // We'll show only the first non-zero value (the one being hovered)
      // Filter to show only bars with values > 0
      const validEntries = payload.filter((entry: any) => entry.value > 0)
      
      if (validEntries.length === 0) return null
      
      // Show only the first entry (the specific bar being hovered)
      const hoveredItem = validEntries[0]
      
      // Extract unit from yAxisLabel (e.g., "Market Value (US$ Million)" -> "US$ Million")
      const unitMatch = yAxisLabel.match(/\(([^)]+)\)/)
      const unit = unitMatch ? unitMatch[1] : yAxisLabel.includes('Units') ? 'Units' : ''
      
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">{xAxisLabel}: {label}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: hoveredItem.color }}
            />
            <span className="font-semibold text-base">{hoveredItem.name}:</span>
            <span className="font-bold text-base">{formatWithCommas(hoveredItem.value, 2)}</span>
            {unit && <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({unit})</span>}
          </div>
        </div>
      )
    }
    return null
  }

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
      <ResponsiveContainer width="100%" height="100%" className="relative z-10">
      <RechartsBarChart
        data={data}
        margin={{
          top: 50,
          right: 40,
          left: 80,
          bottom: 80,
        }}
        barGap={0.4}
        barCategoryGap={data.length > 1 ? 0.5 : 0.2}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
        <XAxis 
          dataKey="year" 
          stroke={isDark ? '#A0AEC0' : '#4A5568'}
          style={{ fontSize: '13px', fontWeight: 500 }}
          angle={0}
          textAnchor="middle"
          height={60}
          interval={0}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
          tickMargin={15}
          label={{
            value: xAxisLabel,
            position: 'insideBottom',
            offset: -10,
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
          tickFormatter={(value) => formatWithCommas(value, 1)}
          width={90}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
          tickMargin={15}
          domain={[0, 'auto']}
          allowDataOverflow={false}
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
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{ fill: 'transparent' }}
          shared={false}
        />
        <Legend 
          wrapperStyle={{ 
            color: isDark ? '#E2E8F0' : '#2D3748', 
            paddingTop: '20px',
            paddingBottom: '10px',
            fontSize: '12px',
            fontWeight: 500
          }}
          iconSize={12}
          iconType="square"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => {
            // Truncate long labels for better readability
            const maxLength = 25
            const displayValue = typeof value === 'string' && value.length > maxLength 
              ? value.substring(0, maxLength) + '...' 
              : value
            return (
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{displayValue}</span>
            )
          }}
        />
        {segmentKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={segmentColors[key]}
            name={key}
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
    </div>
  )
}

