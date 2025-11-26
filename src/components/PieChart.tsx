import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber, formatWithCommas } from '../utils/dataGenerator'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B9D', '#C44569', '#1B9CFC', '#55E6C1']

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  colors?: string[]
  title?: string
  isVolume?: boolean
  showCountry?: boolean | string[]
}

export function PieChart({ data, dataKey, nameKey, colors = COLORS, title, isVolume = false, showCountry = false }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const total = data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const dataEntry = item.payload || {}
      const actualName = dataEntry[nameKey] || item.name || 'Unknown'
      const value = item.value || 0
      const percentage = total > 0 ? (value / total) * 100 : 0
      const valueLabel = isVolume ? 'Units' : 'Value'
      const nameLabel = nameKey === 'disease' ? 'Disease' : nameKey === 'region' ? 'Region' : nameKey === 'brand' ? 'Brand' : nameKey === 'channel' ? 'Channel' : nameKey === 'gender' ? 'Gender' : 'Category'
      const country = dataEntry.country
      
      // Handle multiple countries
      const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
      
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-3">{nameLabel}: {actualName}</p>
          {countriesToShow.length > 0 && (
            <p className="text-sm mb-2">
              {countriesToShow.length === 1 ? 'Country' : 'Countries'}: <strong>{countriesToShow.join(', ')}</strong>
            </p>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{valueLabel}:</span>
              <span className="text-sm font-bold">{formatWithCommas(value, 2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Percentage:</span>
              <span className="text-sm font-bold">{percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-400 flex items-center justify-between">
            <span className="font-semibold text-base">Total:</span>
            <span className="font-bold text-base">{formatWithCommas(total, 2)}</span>
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
      <RechartsPieChart>
        {title && (
          <text
            x="50%"
            y="30"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </text>
        )}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
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
          formatter={(value, entry: any) => {
            // Get the actual name from the payload (data entry)
            const payload = entry.payload
            const actualName = payload && payload[nameKey] ? payload[nameKey] : value
            const percentage = total > 0 ? ((payload && payload[dataKey] ? payload[dataKey] : 0) / total) * 100 : 0
            return (
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                {`${actualName} (${percentage.toFixed(1)}%)`}
              </span>
            )
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
    </div>
  )
}

