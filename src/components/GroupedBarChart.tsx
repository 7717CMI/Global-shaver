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
import { getChartColors } from '../utils/chartColors'

interface GroupedBarChartProps {
  data: Array<{ year: number; country: string; [key: string]: any }>
  dataKey: string
  xAxisLabel?: string
  yAxisLabel?: string
}

export function GroupedBarChart({ 
  data, 
  dataKey, 
  xAxisLabel = 'Year', 
  yAxisLabel = 'Value' 
}: GroupedBarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Transform data: group by year, then by country
  const transformedData = useMemo(() => {
    const grouped: Record<number, Record<string, number>> = {}
    const uniqueCountries = new Set<string>()
    
    data.forEach((entry) => {
      const year = entry.year
      const country = entry.country
      const value = entry[dataKey] || 0
      
      if (!grouped[year]) {
        grouped[year] = {}
      }
      if (country) {
        uniqueCountries.add(country)
        grouped[year][country] = (grouped[year][country] || 0) + value
      }
    })
    
    // Get unique countries for colors
    const countriesArray = Array.from(uniqueCountries).sort()
    const colors = getChartColors(countriesArray.length)
    const countryColors: Record<string, string> = {}
    countriesArray.forEach((country, index) => {
      countryColors[country] = colors[index % colors.length]
    })
    
    // Convert to array format with each country as a property
    const years = Object.keys(grouped).map(y => parseInt(y)).sort()
    const chartData = years.map((year) => {
      const result: any = { year: String(year) }
      countriesArray.forEach((country) => {
        result[country] = grouped[year][country] || 0
      })
      return result
    })
    
    return {
      chartData,
      countries: countriesArray,
      colors: countryColors,
    }
  }, [data, dataKey])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">Year: {label}</p>
          {payload
            .filter((entry: any) => entry.value > 0)
            .map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-semibold">{entry.name}:</span>
                <span className="text-sm font-bold">{formatNumber(entry.value)}</span>
              </div>
            ))
          }
        </div>
      )
    }
    return null
  }

  if (!transformedData.chartData || transformedData.chartData.length === 0 || transformedData.countries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
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
        <RechartsBarChart
          data={transformedData.chartData}
          margin={{
            top: 50,
            right: 40,
            left: 80,
            bottom: 80,
          }}
          barGap={0.4}
          barCategoryGap={transformedData.chartData.length > 1 ? 0.5 : 0.2}
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
            tickFormatter={(value) => formatNumber(value)}
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
          <Tooltip content={<CustomTooltip />} />
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
            formatter={(value) => (
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{value}</span>
            )}
          />
          {transformedData.countries.map((country) => (
            <Bar
              key={country}
              dataKey={country}
              fill={transformedData.colors[country]}
              name={country}
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

