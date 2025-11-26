import { useMemo } from 'react'
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatWithCommas } from '../utils/dataGenerator'

interface BubbleData {
  region: string
  cagrIndex: number
  marketShareIndex: number
  incrementalOpportunity: number
  description?: string
}

interface BubbleChartProps {
  data: BubbleData[]
  xAxisLabel?: string
  yAxisLabel?: string
}

// All bubbles use blue color with 3D effect (matching screenshot)
const BUBBLE_COLOR = '#0075FF' // Blue color for all bubbles

export function BubbleChart({ 
  data, 
  xAxisLabel = 'CAGR Index', 
  yAxisLabel = 'Market Share Index'
}: BubbleChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Normalize bubble sizes based on CAGR Index for visualization
  const maxCagr = Math.max(...data.map(d => d.cagrIndex))
  const minCagr = Math.min(...data.map(d => d.cagrIndex))
  const cagrSizeRange = maxCagr - minCagr

  const transformedData = useMemo(() => {
    return data.map(item => {
      // Scale bubble size based on CAGR Index (min 30, max 100)
      // Higher CAGR = larger bubble
      const normalizedSize = cagrSizeRange > 0
        ? 30 + ((item.cagrIndex - minCagr) / cagrSizeRange) * 70
        : 50

      return {
        ...item,
        z: normalizedSize, // Recharts uses 'z' for bubble size
        size: normalizedSize, // Keep for custom shape
      }
    })
  }, [data, maxCagr, minCagr, cagrSizeRange])

  // Calculate padding needed for largest bubble to be fully visible
  // We need to add sufficient padding to ensure the largest bubble doesn't get cut off
  const cagrMin = Math.min(...transformedData.map(d => d.cagrIndex))
  const cagrMax = Math.max(...transformedData.map(d => d.cagrIndex))
  const cagrRange = cagrMax - cagrMin
  const shareMin = Math.min(...transformedData.map(d => d.marketShareIndex))
  const shareMax = Math.max(...transformedData.map(d => d.marketShareIndex))
  const shareRange = shareMax - shareMin

  // Find the largest bubble size to calculate proper padding
  const maxBubbleSize = Math.max(...transformedData.map(d => d.size || 50))

  // Calculate padding: use generous percentage to ensure all bubbles are fully visible
  // Add extra padding based on the largest bubble size (convert pixel size to data units)
  const bubblePaddingFactor = maxBubbleSize / 150 // Adjust based on typical chart width
  const cagrPaddingTop = Math.max(2.5, cagrMax * 0.35 * bubblePaddingFactor) // 35% of max value with bubble factor
  const sharePaddingTop = Math.max(2.0, shareMax * 0.35 * bubblePaddingFactor) // 35% of max value with bubble factor

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">{data.region}</p>
          <p className="text-sm mb-1">
            <strong>CAGR Index:</strong> {data.cagrIndex.toFixed(2)}
          </p>
          <p className="text-sm mb-1">
            <strong>Market Share Index:</strong> {data.marketShareIndex.toFixed(2)}
          </p>
          <p className="text-sm">
            <strong>Incremental Opportunity:</strong> {formatWithCommas(data.incrementalOpportunity, 1)} US$ Mn
          </p>
          {data.description && (
            <p className="text-xs mt-2 italic text-text-secondary-light dark:text-text-secondary-dark">
              {data.description}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Custom shape for 3D bubbles - all blue with 3D effect
  const CustomShape = (props: any): JSX.Element => {
    const { cx, cy, payload } = props
    const region = payload?.region || 'Unknown'
    const size = payload?.size || 50
    
    // Ensure cx and cy are valid numbers, default to 0 if not
    const x = typeof cx === 'number' ? cx : 0
    const y = typeof cy === 'number' ? cy : 0
    
    // Create unique ID for each bubble to avoid gradient conflicts
    const bubbleId = `bubble-${region.replace(/\s+/g, '-').toLowerCase()}`
    
    return (
      <g>
        {/* Shadow for 3D effect */}
        <circle
          cx={x}
          cy={y + 3}
          r={size / 2}
          fill="rgba(0, 0, 0, 0.2)"
          opacity={0.3}
        />
        {/* Main bubble with gradient for 3D effect */}
        <defs>
          <radialGradient id={`gradient-${bubbleId}`}>
            <stop offset="0%" stopColor={BUBBLE_COLOR} stopOpacity={1} />
            <stop offset="50%" stopColor={BUBBLE_COLOR} stopOpacity={0.9} />
            <stop offset="100%" stopColor={BUBBLE_COLOR} stopOpacity={0.7} />
          </radialGradient>
          <filter id={`glow-${bubbleId}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={x}
          cy={y}
          r={size / 2}
          fill={`url(#gradient-${bubbleId})`}
          filter={`url(#glow-${bubbleId})`}
          stroke={BUBBLE_COLOR}
          strokeWidth={2}
          style={{
            transition: 'all 0.3s ease',
          }}
        />
        {/* Highlight for 3D effect */}
        <circle
          cx={x - size / 6}
          cy={y - size / 6}
          r={size / 4}
          fill="rgba(255, 255, 255, 0.4)"
        />
      </g>
    )
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
        <RechartsScatterChart
          margin={{
            top: 80,
            right: 100,
            left: 100,
            bottom: 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
          <XAxis
            type="number"
            dataKey="cagrIndex"
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
            tickMargin={10}
            domain={[0, Math.ceil(cagrMax + cagrPaddingTop)]}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
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
            type="number"
            dataKey="marketShareIndex"
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
            tickMargin={10}
            domain={[0, Math.ceil(shareMax + sharePaddingTop)]}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
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
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name="Regions" 
            data={transformedData} 
            fill={BUBBLE_COLOR}
            shape={CustomShape}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={BUBBLE_COLOR} />
            ))}
          </Scatter>
        </RechartsScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`px-4 py-2 rounded-lg border ${
          isDark
            ? 'bg-navy-card border-navy-light'
            : 'bg-white border-gray-300'
        }`}>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            *Size of the bubble indicates CAGR Index (higher CAGR = larger bubble)
          </p>
        </div>
      </div>
    </div>
  )
}

