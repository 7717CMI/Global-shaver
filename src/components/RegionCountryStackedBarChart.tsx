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

interface RegionCountryStackedBarChartProps {
  data: Array<{ region: string; country: string; year?: number; yearRegion?: string; [key: string]: any }>
  dataKey: string
  xAxisLabel?: string
  yAxisLabel?: string
  showPercentage?: boolean
}

export function RegionCountryStackedBarChart({ 
  data, 
  dataKey, 
  xAxisLabel = 'Region', 
  yAxisLabel = 'Value',
  showPercentage = false
}: RegionCountryStackedBarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Transform data: group by year-region, then by country
  const transformedData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {}
    const yearRegionMap: Record<string, { year: number; region: string }> = {}
    
    data.forEach((entry) => {
      // Use yearRegion if available (for year-grouped data), otherwise fall back to region
      const groupKey = entry.yearRegion || entry.region
      const country = entry.country
      const value = entry[dataKey] || 0
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = {}
        yearRegionMap[groupKey] = {
          year: entry.year || 0,
          region: entry.region
        }
      }
      grouped[groupKey][country] = (grouped[groupKey][country] || 0) + value
    })
    
    // Get unique countries for colors
    const uniqueCountries = new Set<string>()
    data.forEach((entry) => {
      if (entry.country) {
        uniqueCountries.add(entry.country)
      }
    })
    
    // Convert to array format with each country as a property
    const countriesArray = Array.from(uniqueCountries).sort()
    const colors = getChartColors(countriesArray.length)
    const countryColors: Record<string, string> = {}
    countriesArray.forEach((country, index) => {
      countryColors[country] = colors[index]
    })
    
    // Sort by year, then by region
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const aInfo = yearRegionMap[a]
      const bInfo = yearRegionMap[b]
      if (aInfo.year !== bInfo.year) {
        return aInfo.year - bInfo.year
      }
      return aInfo.region.localeCompare(bInfo.region)
    })
    
    return {
      chartData: sortedKeys.map((groupKey) => {
        const result: any = { 
          yearRegion: groupKey,
          year: yearRegionMap[groupKey].year,
          yearLabel: String(yearRegionMap[groupKey].year),
          region: yearRegionMap[groupKey].region
        }
        countriesArray.forEach((country) => {
          result[country] = grouped[groupKey][country] || 0
        })
        return result
      }),
      countries: countriesArray,
      colors: countryColors,
    }
  }, [data, dataKey])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload
      const year = dataPoint?.year
      const region = dataPoint?.region
      
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          {year && (
            <p className="font-bold text-base mb-1">Year: {year}</p>
          )}
          <p className="font-bold text-base mb-2">Region: {region || label}</p>
          {payload
            .filter((entry: any) => entry.value > 0)
            .map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-semibold">{entry.name}:</span>
                <span className="text-sm font-bold">
                  {formatNumber(entry.value)}
                  {showPercentage && '%'}
                </span>
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
          top: 20,
          right: 20,
          left: 60,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
        <XAxis 
          dataKey="yearLabel" 
          stroke={isDark ? '#A0AEC0' : '#4A5568'}
          style={{ fontSize: '12px', fontWeight: 500 }}
          angle={0}
          textAnchor="middle"
          height={60}
          interval={0}
          tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
          tickMargin={10}
          label={{
            value: xAxisLabel || 'Year',
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
            paddingTop: '10px',
            paddingBottom: '5px',
            fontSize: '11px',
            fontWeight: 500,
            maxHeight: '100px',
            overflowY: 'auto'
          }}
          iconSize={10}
          iconType="square"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => (
            <span style={{ fontSize: '11px', fontWeight: 500 }}>{value}</span>
          )}
        />
        {transformedData.countries.map((country, index) => (
          <Bar
            key={country}
            dataKey={country}
            stackId="a"
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

