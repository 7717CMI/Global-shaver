import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
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

interface PieChartWithDiseasesProps {
  data: Array<{ region: string; disease: string; [key: string]: any; label: string }>
  dataKey: string
  nameKey: string
  diseaseKey: string
  uniqueDiseases: string[]
}

export function PieChartWithDiseases({ data, dataKey, nameKey, diseaseKey, uniqueDiseases }: PieChartWithDiseasesProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const total = data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0)

  // Create color map for diseases
  const diseaseColorMap: Record<string, string> = {}
  uniqueDiseases.forEach((disease, index) => {
    diseaseColorMap[disease] = DISEASE_COLORS[disease] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const dataEntry = item.payload || {}
      const region = dataEntry.region || 'Unknown'
      const disease = dataEntry[diseaseKey] || 'Unknown'
      const value = item.value || 0
      const percentage = total > 0 ? (value / total) * 100 : 0
      
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-sm mb-2">Region: {region}</p>
          <p className="font-bold text-sm mb-2">Disease: {disease}</p>
          <p className="text-sm">
            Incidence: <strong>{formatNumber(value)}</strong>
          </p>
          <p className="text-sm">
            Percentage: <strong>{percentage.toFixed(1)}%</strong>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
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
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={diseaseColorMap[entry[diseaseKey]] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            color: isDark ? '#FFFFFF' : '#2D3748', 
            paddingTop: '10px',
            fontSize: '10px',
            maxHeight: '100px',
            overflowY: 'auto'
          }}
          iconSize={8}
          formatter={(value, entry: any) => {
            const payload = entry.payload
            if (!payload) return value
            const region = payload.region || ''
            const disease = payload[diseaseKey] || value
            const percentage = total > 0 ? ((payload[dataKey] || 0) / total) * 100 : 0
            return (
              <span style={{ fontSize: '10px' }}>
                {`${region} - ${disease} (${percentage.toFixed(1)}%)`}
              </span>
            )
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

