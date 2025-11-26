import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/dataGenerator'

interface BarChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  color?: string
  xAxisLabel?: string
  yAxisLabel?: string
  isVolume?: boolean
  showCountry?: boolean | string[]
}

export function BarChart({ data, dataKey, nameKey, color = '#0075FF', xAxisLabel, yAxisLabel, isVolume = false, showCountry = false }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const valueLabel = isVolume ? 'Units' : (yAxisLabel || 'Value')
      const payloadData = payload[0].payload || {}
      const country = payloadData.country
      
      // Get the actual name from the payload
      const actualLabel = payloadData[nameKey || 'name'] || label || 'Unknown'
      
      // Handle multiple countries
      const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
      
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">{actualLabel}</p>
          {countriesToShow.length > 0 && (
            <p className="text-sm mb-1">
              {countriesToShow.length === 1 ? 'Country' : 'Countries'}: <strong>{countriesToShow.join(', ')}</strong>
            </p>
          )}
          <p className="text-sm font-bold">
            {valueLabel}: {formatNumber(value)}
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
      <RechartsBarChart
        data={data}
        margin={{
          top: 50,
          right: 40,
          left: 80,
          bottom: 120,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
        <XAxis 
          dataKey={nameKey || "name"} 
          stroke={isDark ? '#A0AEC0' : '#4A5568'}
          style={{ fontSize: '13px', fontWeight: 500 }}
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
          tickMargin={10}
          label={{
            value: xAxisLabel || nameKey || 'Category',
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
          tickFormatter={(value) => formatNumber(value)}
          width={90}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
          tickMargin={15}
          domain={[0, 'auto']}
          allowDataOverflow={false}
          label={{
            value: yAxisLabel || 'Value',
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
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={50} />
      </RechartsBarChart>
    </ResponsiveContainer>
    </div>
  )
}

