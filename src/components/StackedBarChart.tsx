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
import { formatNumber } from '../utils/dataGenerator'

const DISEASE_COLORS: Record<string, string> = {
  'HBV': '#0088FE',
  'Influenza': '#00C49F',
  'Pneumococcal': '#FFBB28',
  'TCV': '#FF8042',
  'MMR': '#8884d8',
  'HPV': '#82ca9d',
  'Herpes': '#FF6B9D',
  'Rotavirus': '#C44569',
  'Meningococcal': '#1B9CFC',
  'Varicella': '#55E6C1',
}

const FALLBACK_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B9D', '#C44569', '#1B9CFC', '#55E6C1']

interface StackedBarChartProps {
  data: Array<{ region: string; disease: string; [key: string]: any; label: string }>
  dataKey: string
  nameKey: string
  diseaseKey: string
  uniqueDiseases: string[]
  xAxisLabel?: string
  yAxisLabel?: string
  showCountry?: boolean | string[]
}

export function StackedBarChart({ data, dataKey, nameKey, diseaseKey, uniqueDiseases, xAxisLabel, yAxisLabel, showCountry = false }: StackedBarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Safety check for empty data
  if (!data || data.length === 0 || !uniqueDiseases || uniqueDiseases.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Transform data for stacked bar chart: group by region, then by disease
  const transformedData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {}
    
    data.forEach((entry) => {
      const region = entry.region
      const disease = entry[diseaseKey]
      const value = entry[dataKey] || 0
      
      if (!grouped[region]) {
        grouped[region] = {}
      }
      grouped[region][disease] = (grouped[region][disease] || 0) + value
    })
    
    // Convert to array format with each disease as a property
    // Preserve country info from first data entry if available
    const countryMap = new Map<string, string>()
    data.forEach((entry) => {
      if (entry.country && !countryMap.has(entry.region)) {
        countryMap.set(entry.region, entry.country)
      }
    })
    
    return Object.entries(grouped).map(([region, diseases]) => {
      const result: any = { region }
      if (countryMap.has(region)) {
        result.country = countryMap.get(region)
      }
      uniqueDiseases.forEach((disease) => {
        result[disease] = diseases[disease] || 0
      })
      return result
    })
  }, [data, dataKey, diseaseKey, uniqueDiseases])

  // Create color map for diseases
  const diseaseColorMap: Record<string, string> = {}
  uniqueDiseases.forEach((disease, index) => {
    diseaseColorMap[disease] = DISEASE_COLORS[disease] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0)
      const payloadData = transformedData.find((d: any) => d[nameKey] === label) || {}
      const country = payloadData.country
      
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-sm mb-2">{nameKey === 'region' ? 'Region' : 'Category'}: {label}</p>
          {(() => {
            const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
            return countriesToShow.length > 0 ? (
              <p className="text-sm mb-1">
                {countriesToShow.length === 1 ? 'Country' : 'Countries'}: <strong>{countriesToShow.join(', ')}</strong>
              </p>
            ) : null
          })()}
          {payload
            .filter((entry: any) => entry.value > 0)
            .map((entry: any) => {
              const percentage = total > 0 ? ((entry.value || 0) / total) * 100 : 0
              return (
                <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                  {entry.name}: <strong>{formatNumber(entry.value)}</strong> ({percentage.toFixed(1)}%)
                </p>
              )
            })
          }
          <p className="text-sm mt-2 pt-2 border-t border-gray-400">
            Total: <strong>{formatNumber(total)}</strong>
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
        data={transformedData}
        margin={{
          top: 50,
          right: 40,
          left: 80,
          bottom: 120,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
        <XAxis 
          dataKey="region" 
          stroke={isDark ? '#A0AEC0' : '#4A5568'}
          style={{ fontSize: '13px', fontWeight: 500 }}
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
          tickMargin={10}
          label={{
            value: xAxisLabel || 'Region',
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
        <Legend 
          wrapperStyle={{ 
            color: isDark ? '#E2E8F0' : '#2D3748', 
            paddingTop: '15px',
            fontSize: '12px',
            fontWeight: 500
          }}
          iconSize={12}
          iconType="circle"
          formatter={(value) => {
            // Truncate long industry names in legend
            const displayValue = value.length > 30 ? value.substring(0, 27) + '...' : value
            return (
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{displayValue}</span>
            )
          }}
        />
        {uniqueDiseases.map((disease) => (
          <Bar
            key={disease}
            dataKey={disease}
            stackId="a"
            fill={diseaseColorMap[disease]}
            name={disease}
            radius={disease === uniqueDiseases[uniqueDiseases.length - 1] ? [8, 8, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
    </div>
  )
}

