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
import { formatNumber } from '../utils/dataGenerator'

interface LineChartProps {
  data: any[]
  dataKeys: string[]
  nameKey: string
  colors?: string[]
  xAxisLabel?: string
  yAxisLabel?: string
  isVolume?: boolean
  showCountry?: boolean | string[]
  yAxisDomain?: [number | string, number | string] | 'auto'
  focusDataRange?: boolean
}

export function LineChart({ data, dataKeys, nameKey, colors = ['#0075FF', '#4FD1C5'], xAxisLabel, yAxisLabel, isVolume = false, showCountry = false, yAxisDomain, focusDataRange = false }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Safety check for empty data
  if (!data || data.length === 0 || !dataKeys || dataKeys.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Calculate focused domain based on actual data range
  const calculateFocusedDomain = (): [number, number] => {
    const allValues: number[] = []
    data.forEach(item => {
      dataKeys.forEach(key => {
        if (item[key] !== undefined && item[key] !== null && typeof item[key] === 'number') {
          allValues.push(item[key])
        }
      })
    })

    if (allValues.length === 0) {
      return [0, 100]
    }

    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const range = max - min
    const padding = range * 0.1 // 10% padding on each side
    
    // Ensure minimum range for better visualization
    const minRange = max * 0.05 // At least 5% of max value
    const actualPadding = Math.max(padding, minRange)
    
    return [
      Math.max(0, min - actualPadding), // Don't go below 0
      max + actualPadding
    ]
  }

  // Determine the y-axis domain to use
  const getYAxisDomain = (): [number | string, number | string] => {
    if (yAxisDomain) {
      return yAxisDomain === 'auto' ? calculateFocusedDomain() : yAxisDomain
    }
    if (focusDataRange) {
      return calculateFocusedDomain()
    }
    return ['auto', 'auto'] // Default behavior
  }

  const domain = getYAxisDomain()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0]?.payload || {}
      const country = payloadData.country
      
      // Handle multiple countries
      const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
      
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-sm mb-2">{nameKey === 'year' ? `Year: ${label}` : label}</p>
          {payload.map((entry: any, index: number) => {
            // Format label for country-specific keys
            let displayName = entry.name
            if (entry.dataKey && entry.dataKey.includes('_prevalence')) {
              const country = entry.dataKey.replace('_prevalence', '')
              displayName = `${country} - Prevalence`
            } else if (entry.dataKey && entry.dataKey.includes('_incidence')) {
              const country = entry.dataKey.replace('_incidence', '')
              displayName = `${country} - Incidence`
            }
            
            // Get YoY value if available
            const yoyKey = entry.dataKey === 'prevalence' ? 'prevalence_yoy' : 
                          entry.dataKey === 'incidence' ? 'incidence_yoy' :
                          entry.dataKey.includes('_prevalence') ? `${entry.dataKey.replace('prevalence', 'prevalence_yoy')}` :
                          entry.dataKey.includes('_incidence') ? `${entry.dataKey.replace('incidence', 'incidence_yoy')}` :
                          entry.dataKey && typeof entry.dataKey === 'string' ? `${entry.dataKey}_yoy` : null
            
            const yoyValue = yoyKey && payloadData[yoyKey] !== null && payloadData[yoyKey] !== undefined 
              ? payloadData[yoyKey] 
              : null
            
            return (
              <div key={index}>
                <p className="text-sm" style={{ color: entry.color }}>
                  {displayName}: <strong>{formatNumber(entry.value)}</strong> {isVolume ? 'units' : ''}
                </p>
                {yoyValue !== null && (
                  <p className="text-xs ml-2 opacity-75" style={{ color: entry.color }}>
                    Y-o-Y: {yoyValue > 0 ? '+' : ''}{yoyValue.toFixed(1)}%
                  </p>
                )}
              </div>
            )
          })}
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
      <RechartsLineChart
        data={data}
          margin={{
            top: 5,
            right: 15,
            left: 65,
            bottom: 100,
          }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
        <XAxis 
          dataKey={nameKey} 
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '10px' }}
          angle={-45}
          textAnchor="end"
          height={90}
          interval={0}
          label={{
            value: xAxisLabel || nameKey,
            position: 'insideBottom',
            offset: 5,
            style: { 
              fontSize: '11px', 
              fill: isDark ? '#FFFFFF' : '#2D3748'
            }
          }}
        />
        <YAxis 
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '10px' }}
          tickFormatter={(value) => formatNumber(value)}
          width={85}
          domain={domain}
          label={{
            value: yAxisLabel || 'Value',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
            style: { 
              fontSize: '11px', 
              fill: isDark ? '#FFFFFF' : '#2D3748',
              textAnchor: 'middle'
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            color: isDark ? '#FFFFFF' : '#2D3748', 
            paddingTop: '5px',
            fontSize: '11px'
          }}
          iconSize={8}
          formatter={(value) => {
            // Format country-specific labels: "USA_prevalence" -> "USA - Prevalence"
            if (value.includes('_prevalence')) {
              const country = value.replace('_prevalence', '')
              return `${country} - Prevalence`
            }
            if (value.includes('_incidence')) {
              const country = value.replace('_incidence', '')
              return `${country} - Incidence`
            }
            // Capitalize first letter of other labels
            return value.charAt(0).toUpperCase() + value.slice(1)
          }}
        />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
    </div>
  )
}

