import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/dataGenerator'

interface ScatterChartProps {
  data: any[]
  xDataKey: string
  yDataKey: string
  nameKey?: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B9D', '#C44569', '#1B9CFC', '#55E6C1']

export function ScatterChart({ data, xDataKey, yDataKey, nameKey, xAxisLabel, yAxisLabel, colors = COLORS }: ScatterChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Safety check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          {nameKey && data[nameKey] && (
            <p className="font-bold text-sm mb-2">{data[nameKey]}</p>
          )}
          <p className="text-sm">
            {xAxisLabel || xDataKey}: <strong>{formatNumber(data[xDataKey])}</strong>
          </p>
          <p className="text-sm">
            {yAxisLabel || yDataKey}: <strong>{formatNumber(data[yDataKey])}</strong>
          </p>
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
      <RechartsScatterChart
        margin={{
          top: 20,
          right: 30,
          left: 80,
          bottom: 80,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
        <XAxis 
          type="number"
          dataKey={xDataKey}
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => formatNumber(value)}
          label={{
            value: xAxisLabel || xDataKey,
            position: 'insideBottom',
            offset: -10,
            style: { 
              fontSize: '14px', 
              fontWeight: 'bold',
              fill: isDark ? '#FFFFFF' : '#2D3748'
            }
          }}
        />
        <YAxis 
          type="number"
          dataKey={yDataKey}
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => formatNumber(value)}
          label={{
            value: yAxisLabel || yDataKey,
            angle: -90,
            position: 'insideLeft',
            offset: -10,
            style: { 
              fontSize: '14px', 
              fontWeight: 'bold',
              fill: isDark ? '#FFFFFF' : '#2D3748',
              textAnchor: 'middle'
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter name="Data" data={data} fill="#0075FF">
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Scatter>
      </RechartsScatterChart>
    </ResponsiveContainer>
    </div>
  )
}

