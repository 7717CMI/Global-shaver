import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { getData, formatWithCommas, clearDataCache, type ShovelMarketData, getProductTypeHierarchy, getSalesChannelHierarchy } from '../utils/dataGenerator'
import { StatBox } from '../components/StatBox'
import { FilterDropdown } from '../components/FilterDropdown'
import { HierarchicalFilterDropdown } from '../components/HierarchicalFilterDropdown'
import { NestedHierarchicalFilterDropdown } from '../components/NestedHierarchicalFilterDropdown'
import { SegmentGroupedBarChart } from '../components/SegmentGroupedBarChart'
import { RegionCountryStackedBarChart } from '../components/RegionCountryStackedBarChart'
import { CrossSegmentStackedBarChart } from '../components/CrossSegmentStackedBarChart'
import { DemoNotice } from '../components/DemoNotice'
import { useTheme } from '../context/ThemeContext'
import { InfoTooltip } from '../components/InfoTooltip'
import { WaterfallChart } from '../components/WaterfallChart'
import { BubbleChart } from '../components/BubbleChart'
import { YoYCAGRChart } from '../components/YoYCAGRChart'

interface MarketAnalysisProps {
  onNavigate: (page: string) => void
}

type MarketEvaluationType = 'By Value' | 'By Volume'

export function MarketAnalysis({ onNavigate }: MarketAnalysisProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [activeTab, setActiveTab] = useState<'standard' | 'incremental' | 'attractiveness' | 'yoy'>('standard')
  const [data, setData] = useState<ShovelMarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    year: [] as number[],
    region: [] as string[],
    country: [] as string[], // Using for region
    productCategory: [] as string[],
    subProductCategory: [] as string[],
    productType: [] as string[], // Kept for backward compatibility
    technology: [] as string[],
    bladeType: [] as string[],
    priceRange: [] as string[],
    bladeMaterial: [] as string[],
    handleLength: [] as string[],
    application: [] as string[],
    endUser: [] as string[], // Using for profession
    distributionChannelType: [] as string[], // Using for sales channel
    distributionChannel: [] as string[],
    marketEvaluation: 'By Value' as MarketEvaluationType,
  })
  
  // Separate filters for incremental tab
  const [incrementalFilters, setIncrementalFilters] = useState({
    region: [] as string[],
    productType: [] as string[],
    country: [] as string[],
  })
  
  // Separate filters for attractiveness tab
  const [attractivenessFilters, setAttractivenessFilters] = useState({
    region: [] as string[],
    productType: [] as string[],
    country: [] as string[],
    segment: 'productType' as string,
  })
  
  // Separate filters for YoY/CAGR tab
  const [yoyFilters, setYoyFilters] = useState({
    region: [] as string[],
    productType: [] as string[],
    country: [] as string[],
    distributionChannel: [] as string[],
  })

  useEffect(() => {
    // Clear cache to ensure fresh data with online channels
    clearDataCache()
    setLoading(true)
    setTimeout(() => {
      try {
        const generatedData = getData()
        setData(generatedData)
        setLoading(false)
        
        setTimeout(() => {
          const availableYears = [...new Set(generatedData.map(d => d.year))].sort()
          const availableRegions = [...new Set(generatedData.map(d => d.region))].filter(Boolean).sort()
          const availableProductCategories = [...new Set(generatedData.map(d => d.productCategory))].filter(Boolean).sort()
          const availableSubProductCategories = [...new Set(generatedData.map(d => d.subProductCategory))].filter(Boolean).sort()
          const availableProductTypes = [...new Set(generatedData.map(d => d.productType))].sort()
          const availableBladeMaterials = [...new Set(generatedData.map(d => d.bladeMaterial))].filter(Boolean).sort()
          const availableHandleLengths = [...new Set(generatedData.map(d => d.handleLength))].filter(Boolean).sort()
          const availableApplications = [...new Set(generatedData.map(d => d.application))].filter(Boolean).sort()
          const availableProfessions = [...new Set(generatedData.map(d => d.endUser))].filter(Boolean).sort()
          const availableSalesChannels = [...new Set(generatedData.map(d => d.distributionChannelType))].filter(Boolean).sort()
          // Default to 2024 and 2025 if available, otherwise use first 2 available years
          const defaultYears = availableYears.includes(2024) && availableYears.includes(2025)
            ? [2024, 2025]
            : availableYears.length >= 2
              ? availableYears.slice(-2)
              : availableYears

          // Default to first 2 items from each filter, but don't pre-select subcategories
          const defaultRegions = availableRegions.slice(0, 2)
          const defaultProductCategories = availableProductCategories.slice(0, 2)
          const defaultBladeMaterials = availableBladeMaterials.slice(0, 2)
          const defaultApplications = availableApplications.slice(0, 2)
          const defaultProfessions = availableProfessions.slice(0, 2)
          const defaultSalesChannels = availableSalesChannels.slice(0, 2)

          setFilters({
            year: defaultYears,
            region: [],
            country: ['US', 'Germany'], // Default 2 countries selected
            productCategory: defaultProductCategories,
            subProductCategory: [], // Don't pre-select to avoid mismatches
            productType: [],
            technology: [],
            bladeType: [],
            priceRange: [],
            bladeMaterial: defaultBladeMaterials,
            handleLength: [],
            application: defaultApplications,
            endUser: [], // Start with no end user selected
            distributionChannelType: defaultSalesChannels,
            distributionChannel: [],
            marketEvaluation: 'By Value',
          })
        }, 0)
      } catch (error) {
        console.error('Error loading data:', error)
        setData([])
        setLoading(false)
      }
    }, 500)
  }, [])

  // Get unique filter options - optimized
  const uniqueOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        years: [],
        countries: [],
        productCategories: [],
        subProductCategories: [],
        productTypes: [],
        bladeMaterials: [],
        handleLengths: [],
        applications: [],
        endUsers: [],
        distributionChannelTypes: [],
      }
    }

    const yearSet = new Set<number>()
    const countrySet = new Set<string>()
    const productCategorySet = new Set<string>()
    const subProductCategorySet = new Set<string>()
    const productTypeSet = new Set<string>()
    const bladeMaterialSet = new Set<string>()
    const handleLengthSet = new Set<string>()
    const applicationSet = new Set<string>()
    const endUserSet = new Set<string>()
    const distributionChannelTypeSet = new Set<string>()

    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      if (d.year) yearSet.add(d.year)
      if (d.region) countrySet.add(d.region) // Map region to country field
      if (d.productCategory) productCategorySet.add(d.productCategory)
      if (d.subProductCategory) subProductCategorySet.add(d.subProductCategory)
      if (d.productType) productTypeSet.add(d.productType)
      if (d.bladeMaterial) bladeMaterialSet.add(d.bladeMaterial)
      if (d.handleLength) handleLengthSet.add(d.handleLength)
      if (d.application) applicationSet.add(d.application)
      if (d.endUser) endUserSet.add(d.endUser) // This contains profession data
      if (d.distributionChannelType) {
        distributionChannelTypeSet.add(d.distributionChannelType) // This contains sales channel data
      }
    }

    const foundTypes = Array.from(distributionChannelTypeSet)
    const foundYears = Array.from(yearSet).sort()
    const foundCountries = Array.from(countrySet).filter(Boolean).sort()
    const foundProductCategories = Array.from(productCategorySet).filter(Boolean).sort()
    const foundSubProductCategories = Array.from(subProductCategorySet).filter(Boolean).sort()
    const foundHandleLengths = Array.from(handleLengthSet).filter(Boolean).sort()
    const foundApplications = Array.from(applicationSet).filter(Boolean).sort()
    const foundEndUsers = Array.from(endUserSet).filter(Boolean).sort()
    const foundProductTypes = Array.from(productTypeSet).filter(Boolean).sort()
    const foundBladeMaterials = Array.from(bladeMaterialSet).filter(Boolean).sort()

    return {
      years: Array.from(yearSet).sort((a, b) => a - b),
      countries: foundCountries || [],
      productCategories: foundProductCategories || [],
      subProductCategories: foundSubProductCategories || [],
      productTypes: Array.from(productTypeSet).filter(Boolean).sort(),
      bladeMaterials: Array.from(bladeMaterialSet).filter(Boolean).sort(),
      handleLengths: Array.from(handleLengthSet).filter(Boolean).sort(),
      applications: Array.from(applicationSet).filter(Boolean).sort(),
      endUsers: Array.from(endUserSet).filter(Boolean).sort(),
      distributionChannelTypes: Array.from(distributionChannelTypeSet).filter(Boolean).sort(),
    }
  }, [data])

  // Filter subcategories based on selected product categories
  const filteredSubCategories = useMemo(() => {
    if (filters.productCategory.length === 0) {
      return uniqueOptions.subProductCategories || []
    }

    // Only show subcategories that belong to selected categories
    const filtered = data
      .filter(d => filters.productCategory.includes(d.productCategory))
      .map(d => d.subProductCategory)

    return [...new Set(filtered)].filter(Boolean).sort()
  }, [data, filters.productCategory, uniqueOptions.subProductCategories])

  // Get all distribution channels from full data, grouped by type
  const distributionChannelGroupedOptions = useMemo(() => {
    const offlineChannels = ['Hardware Stores', 'Specialty Garden Centers', 'Agricultural Supply Stores']
    const onlineChannels = ['Ecommerce Website', "Brand's/Company's Own Website"]
    
    // Get all channels that exist in the data
    if (!data || data.length === 0) return []
    
    const channelSet = new Set<string>()
    data.forEach(d => {
      if (d.distributionChannel) channelSet.add(d.distributionChannel)
    })
    
    const allChannels = Array.from(channelSet)
    
    // Filter channels based on selected types
    const groups: Array<{ group: string; items: string[] }> = []
    
    if (filters.distributionChannelType.length === 0) {
      // No type selected - show all channels grouped
      const availableOffline = offlineChannels.filter(ch => allChannels.includes(ch))
      const availableOnline = onlineChannels.filter(ch => allChannels.includes(ch))
      
      if (availableOffline.length > 0) {
        groups.push({
          group: 'Offline',
          items: availableOffline
        })
      }
      
      if (availableOnline.length > 0) {
        groups.push({
          group: 'Online',
          items: availableOnline
        })
      }
    } else {
      // Show only channels for selected types, but always show both groups if both types are selected
      const hasOffline = filters.distributionChannelType.includes('Offline')
      const hasOnline = filters.distributionChannelType.includes('Online')
      
      if (hasOffline) {
        const availableOffline = offlineChannels.filter(ch => allChannels.includes(ch))
        if (availableOffline.length > 0) {
          groups.push({
            group: 'Offline',
            items: availableOffline
          })
        }
      }
      
      if (hasOnline) {
        const availableOnline = onlineChannels.filter(ch => allChannels.includes(ch))
        if (availableOnline.length > 0) {
          groups.push({
            group: 'Online',
            items: availableOnline
          })
        }
      }
    }
    
    return groups
  }, [data, filters.distributionChannelType])

  // Get flat list of available distribution channels based on selected types
  const availableDistributionChannels = useMemo(() => {
    if (!data || data.length === 0) return []
    
    const channelSet = new Set<string>()
    
    if (filters.distributionChannelType.length === 0) {
      // No type filter - include all channels
      data.forEach(d => {
        if (d.distributionChannel) channelSet.add(d.distributionChannel)
      })
    } else {
      // Filter by selected types
      const filteredData = data.filter(d => 
        filters.distributionChannelType.includes(d.distributionChannelType)
      )
      filteredData.forEach(d => {
        if (d.distributionChannel) channelSet.add(d.distributionChannel)
      })
    }
    
    return Array.from(channelSet).sort()
  }, [data, filters.distributionChannelType])

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (filters.year.length > 0) {
      filtered = filtered.filter(d => filters.year.includes(d.year))
    }
    if (filters.country.length > 0) {
      filtered = filtered.filter(d => filters.country.includes(d.country || d.region))
    }
    if (filters.productCategory.length > 0) {
      filtered = filtered.filter(d => filters.productCategory.includes(d.productCategory))
    }
    if (filters.subProductCategory.length > 0) {
      filtered = filtered.filter(d => filters.subProductCategory.includes(d.subProductCategory))
    }
    // Handle hierarchical product type filter
    if (filters.productType.length > 0) {
      filtered = filtered.filter(d => {
        return filters.productType.some(selected => {
          if (selected === d.productCategory || selected === d.productType) return true
          if (selected.includes(' - ')) {
            const [mainCat, subCat] = selected.split(' - ')
            return d.productCategory === mainCat && d.subProductCategory === subCat
          }
          return false
        })
      })
    }
    // Handle hierarchical technology filter - maps to bladeMaterial field
    if (filters.technology.length > 0) {
      filtered = filtered.filter(d => {
        return filters.technology.some(selected => {
          const mainCat = selected.includes(' - ') ? selected.split(' - ')[0] : selected
          // Map technology filter to existing data fields
          return d.bladeMaterial?.includes(mainCat) || d.application?.includes(mainCat)
        })
      })
    }
    // Handle blade type filter - maps to bladeMaterial field
    if (filters.bladeType.length > 0) {
      filtered = filtered.filter(d => filters.bladeType.some(bt => d.bladeMaterial?.includes(bt)))
    }
    // Handle price range filter - maps to handleLength field
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(d => filters.priceRange.some(pr => d.handleLength?.includes(pr)))
    }
    if (filters.bladeMaterial.length > 0) {
      filtered = filtered.filter(d => filters.bladeMaterial.includes(d.bladeMaterial))
    }
    if (filters.handleLength.length > 0) {
      filtered = filtered.filter(d => filters.handleLength.includes(d.handleLength))
    }
    if (filters.application.length > 0) {
      filtered = filtered.filter(d => filters.application.includes(d.application))
    }
    // Handle hierarchical end user filter
    if (filters.endUser.length > 0) {
      filtered = filtered.filter(d => {
        return filters.endUser.some(selected => {
          if (selected === d.endUser) return true
          if (selected.includes(' - ')) {
            const [, subCat] = selected.split(' - ')
            return d.endUser === subCat
          }
          // Check if main category matches
          return d.endUser?.includes(selected)
        })
      })
    }
    // Handle hierarchical distribution channel filter
    if (filters.distributionChannel.length > 0) {
      filtered = filtered.filter(d => {
        return filters.distributionChannel.some(selected => {
          if (selected === d.distributionChannel || selected === d.distributionChannelType) return true
          if (selected.includes(' - ')) {
            const [mainCat, subCat] = selected.split(' - ')
            return d.distributionChannelType === mainCat && d.distributionChannel === subCat
          }
          return false
        })
      })
    }
    if (filters.distributionChannelType.length > 0) {
      filtered = filtered.filter(d => filters.distributionChannelType.includes(d.distributionChannelType))
    }

    return filtered
  }, [data, filters])

  // Get data value based on market evaluation type
  const getDataValue = (d: any): number => {
    if (filters.marketEvaluation === 'By Volume') {
      return d.volumeUnits || 0
    }
    return (d.marketValueUsd || 0) / 1000 // Convert to millions
  }

  const getDataLabel = (): string => {
    return filters.marketEvaluation === 'By Volume' ? 'Market Volume (Units)' : 'Market Size (US$ Million)'
  }

  // Analysis data for charts - Market segment based
  const analysisData = useMemo(() => {
    // Generate demo data based on selected filters
    const generateDemoData = () => {
      const years = filters.year.length > 0 ? filters.year : [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]
      const countries = filters.country.length > 0 ? filters.country : ['US', 'Germany', 'China', 'Japan']

      // Product type hierarchy
      const productTypeHierarchy: Record<string, string[]> = {
        'Foil Shavers': ['Single-foil', 'Dual-foil', 'Multi-foil (3+)'],
        'Rotary Shavers': ['Dual-head', 'Triple-head', 'Multi-head (4+)'],
        'Trimmers & Groomers': ['Beard trimmers', 'Body groomers', 'Others'],
        'Hybrid Shavers': ['Blade-electric combo', 'Wet & dry hybrid tools'],
        'Lady Shavers': ['Face shavers', 'Body shavers', 'Bikini trimmers'],
        'Hair Clippers': ['Corded clippers', 'Cordless clippers', 'Others']
      }

      // Get selected product types or use defaults
      let productTypes: string[] = []
      if (filters.productType.length > 0) {
        filters.productType.forEach(pt => {
          if (pt.includes(' - ')) {
            productTypes.push(pt.split(' - ')[1])
          } else {
            productTypes.push(pt)
          }
        })
      } else {
        productTypes = Object.keys(productTypeHierarchy)
      }

      // Technology options
      const technologies = filters.technology.length > 0
        ? filters.technology.map(t => t.includes(' - ') ? t.split(' - ')[1] : t)
        : ['Corded', 'Cordless / Rechargeable']

      // Blade types
      const bladeTypes = filters.bladeType.length > 0
        ? filters.bladeType
        : ['Stainless Steel Blades', 'Titanium-coated Blades', 'Carbon Steel', 'Ceramic Blades']

      // Price ranges
      const priceRanges = filters.priceRange.length > 0
        ? filters.priceRange
        : ['Economy', 'Mid-Range', 'Premium']

      // End users
      const endUserHierarchy: Record<string, string[]> = {
        'Home Users': ['Men', 'Women', 'Unisex'],
        'Professional Users': ['Barbers', 'Salons', 'Grooming service providers', 'Others']
      }
      let endUsers: string[] = []
      if (filters.endUser.length > 0) {
        filters.endUser.forEach(eu => {
          if (eu.includes(' - ')) {
            endUsers.push(eu.split(' - ')[1])
          } else {
            endUsers.push(eu)
          }
        })
      } else {
        endUsers = Object.keys(endUserHierarchy)
      }

      // Distribution channels
      const distributionChannels = filters.distributionChannel.length > 0
        ? filters.distributionChannel.map(dc => dc.includes(' - ') ? dc.split(' - ')[1] : dc)
        : ['Offline', 'Online']

      // Base market values by country (in millions)
      const countryBaseValues: Record<string, number> = {
        'US': 15000,
        'Germany': 5200,
        'China': 12800,
        'Japan': 6800
      }

      // Growth rates
      const yearGrowthRate = 1.065 // 6.5% annual growth

      // Generate chart data for product types
      const productTypeChartData = years.map(year => {
        const entry: Record<string, number | string> = { year: String(year) }
        const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)
        const countryMultiplier = countries.reduce((sum, c) => sum + (countryBaseValues[c] || 5000), 0) / 40000

        productTypes.forEach((pt, idx) => {
          const baseValue = (8000 - idx * 800) * countryMultiplier * yearMultiplier
          entry[pt] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
        })
        return entry
      })

      // Generate stacked data for blade types
      const bladeTypeStackedData = {
        chartData: years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)
          const countryMultiplier = countries.reduce((sum, c) => sum + (countryBaseValues[c] || 5000), 0) / 40000

          bladeTypes.forEach((bt, idx) => {
            const baseValue = (6000 - idx * 1000) * countryMultiplier * yearMultiplier
            entry[bt] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
          })
          return entry
        }),
        segments: bladeTypes
      }

      // Generate stacked data for price ranges
      const priceRangeStackedData = {
        chartData: years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)
          const countryMultiplier = countries.reduce((sum, c) => sum + (countryBaseValues[c] || 5000), 0) / 40000

          priceRanges.forEach((pr, idx) => {
            const baseValue = (7000 - idx * 1500) * countryMultiplier * yearMultiplier
            entry[pr] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
          })
          return entry
        }),
        segments: priceRanges
      }

      // Generate stacked data for end users
      const endUserStackedData = {
        chartData: years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)
          const countryMultiplier = countries.reduce((sum, c) => sum + (countryBaseValues[c] || 5000), 0) / 40000

          endUsers.forEach((eu, idx) => {
            const baseValue = (10000 - idx * 2000) * countryMultiplier * yearMultiplier
            entry[eu] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
          })
          return entry
        }),
        segments: endUsers
      }

      // Generate stacked data for distribution channels
      const distributionChannelStackedData = {
        chartData: years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)
          const countryMultiplier = countries.reduce((sum, c) => sum + (countryBaseValues[c] || 5000), 0) / 40000

          distributionChannels.forEach((dc, idx) => {
            const baseValue = (12000 - idx * 3000) * countryMultiplier * yearMultiplier
            entry[dc] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
          })
          return entry
        }),
        segments: distributionChannels
      }

      // Generate country chart data
      const countryChartData = years.map(year => {
        const entry: Record<string, number | string> = { year: String(year) }
        const yearMultiplier = Math.pow(yearGrowthRate, year - 2024)

        countries.forEach(country => {
          const baseValue = (countryBaseValues[country] || 5000) * yearMultiplier
          entry[country] = Math.round(baseValue * (0.9 + Math.random() * 0.2))
        })
        return entry
      })

      return {
        productCategoryChartData: productTypeChartData,
        subProductCategoryChartData: [],
        productTypeChartData,
        bladeMaterialChartData: bladeTypeStackedData.chartData,
        handleLengthChartData: priceRangeStackedData.chartData,
        applicationChartData: [],
        endUserChartData: endUserStackedData.chartData,
        countryChartData,
        regionCountryPercentageChartData: countryChartData,
        productCategories: productTypes,
        subProductCategories: [],
        productTypes,
        bladeMaterials: bladeTypes,
        handleLengths: priceRanges,
        applications: [],
        endUsers,
        countries,
        regionsForChart: countries,
        bladeMaterialStackedData: bladeTypeStackedData,
        handleLengthStackedData: priceRangeStackedData,
        applicationStackedData: { chartData: [], segments: [] },
        endUserStackedData,
        distributionChannelTypeStackedData: distributionChannelStackedData,
        offlineChannelStackedData: { chartData: [], segments: [] },
        onlineChannelStackedData: { chartData: [], segments: [] },
      }
    }

    if (filteredData.length === 0) {
      return generateDemoData()
    }

    const years = [...new Set(filteredData.map(d => d.year))].sort()

    // Helper function to generate segment chart data
    const generateSegmentChartData = (
      segmentKey: string,
      getSegmentValue: (d: any) => string,
      selectedSegments?: string[]
    ) => {
      // Use selected segments from filter if provided, otherwise use segments from filtered data
      const segmentsFromData = [...new Set(filteredData.map(getSegmentValue))].filter(Boolean).sort()
      const segments = selectedSegments && selectedSegments.length > 0 
        ? selectedSegments.filter(s => s).sort() 
        : segmentsFromData
      
      const segmentMap = new Map<string, number>()
      
      filteredData.forEach(d => {
        const key = `${d.year}-${getSegmentValue(d)}`
        segmentMap.set(key, (segmentMap.get(key) || 0) + getDataValue(d))
      })

      const chartData = years.map((year) => {
        const entry: Record<string, number | string> = { year: String(year) }
        segments.forEach((segment) => {
          const key = `${year}-${segment}`
          entry[segment] = segmentMap.get(key) || 0
        })
        return entry
      })

      return { chartData, segments }
    }

    // Helper function to generate year-wise stacked bar chart data
    const generateYearWiseStackedBarData = (
      getSegmentValue: (d: any) => string,
      selectedSegments?: string[]
    ) => {
      const segmentsFromData = [...new Set(filteredData.map(getSegmentValue))].filter(Boolean).sort()
      const segments = selectedSegments && selectedSegments.length > 0 
        ? selectedSegments.filter(s => s).sort() 
        : segmentsFromData
      
      // Group by year, then by segment
      const yearSegmentMap = new Map<number, Map<string, number>>()
      
      filteredData.forEach(d => {
        const year = d.year
        const segment = getSegmentValue(d)
        if (segment) {
          if (!yearSegmentMap.has(year)) {
            yearSegmentMap.set(year, new Map<string, number>())
          }
          const segmentMap = yearSegmentMap.get(year)!
          segmentMap.set(segment, (segmentMap.get(segment) || 0) + getDataValue(d))
        }
      })

      // Convert to array format for stacked bar chart
      const chartData = years.map(year => {
        const entry: Record<string, number | string> = { year: String(year) }
        const segmentMap = yearSegmentMap.get(year) || new Map<string, number>()
        segments.forEach(segment => {
          entry[segment] = segmentMap.get(segment) || 0
        })
        return entry
      })

      // Filter segments that have at least one non-zero value
      const activeSegments = segments.filter(segment => 
        chartData.some(entry => (entry[segment] as number) > 0)
      )

      return { chartData, segments: activeSegments }
    }

    // Product Category Chart - use selected filters to show all selected options
    const productCategoryData = generateSegmentChartData(
      'productCategory',
      (d) => d.productCategory || '',
      filters.productCategory.length > 0 ? filters.productCategory : undefined
    )

    // Sub Product Category Chart - use selected filters to show all selected options
    const subProductCategoryData = generateSegmentChartData(
      'subProductCategory',
      (d) => d.subProductCategory || '',
      filters.subProductCategory.length > 0 ? filters.subProductCategory : undefined
    )

    // Product Type Chart (kept for backward compatibility) - use selected filters to show all selected options
    const productTypeData = generateSegmentChartData(
      'productType',
      (d) => d.productType || '',
      filters.productType.length > 0 ? filters.productType : undefined
    )

    // Blade Material Chart - use selected filters to show all selected options
    const bladeMaterialData = generateSegmentChartData(
      'bladeMaterial', 
      (d) => d.bladeMaterial || '',
      filters.bladeMaterial.length > 0 ? filters.bladeMaterial : undefined
    )

    // Handle Length Chart - use selected filters to show all selected options
    const handleLengthData = generateSegmentChartData(
      'handleLength', 
      (d) => d.handleLength || '',
      filters.handleLength.length > 0 ? filters.handleLength : undefined
    )

    // Application Chart - use selected filters to show all selected options
    const applicationData = generateSegmentChartData(
      'application', 
      (d) => d.application || '',
      filters.application.length > 0 ? filters.application : undefined
    )

    // End User Chart - use selected filters to show all selected options
    const endUserData = generateSegmentChartData(
      'endUser', 
      (d) => d.endUser || '',
      filters.endUser.length > 0 ? filters.endUser : undefined
    )

    // Region Chart - use selected filters to show all selected options (changed from Country to Region)
    const regionsFromData = [...new Set(filteredData.map(d => d.region))].filter(Boolean).sort()
    const regionsForChart = filters.region && filters.region.length > 0
      ? filters.region.filter(r => r).sort()
      : regionsFromData
    const regionMap = new Map<string, number>()
    filteredData.forEach(d => {
      const key = `${d.year}-${d.region}`
      regionMap.set(key, (regionMap.get(key) || 0) + getDataValue(d))
    })
    const countryChartData = years.map((year) => {
      const entry: Record<string, number | string> = { year: String(year) }
      regionsForChart.forEach((region) => {
        const key = `${year}-${region}`
        entry[region] = regionMap.get(key) || 0
      })
      return entry
    })


    // Region Distribution by Year (simplified to show only regions, no countries)
    const regionYearTotals: Record<string, Record<string, number>> = {}

    filteredData.forEach((d) => {
      const value = getDataValue(d)
      const year = d.year
      const region = d.region
      const yearKey = String(year)

      if (!regionYearTotals[yearKey]) {
        regionYearTotals[yearKey] = {}
      }
      if (!regionYearTotals[yearKey][region]) {
        regionYearTotals[yearKey][region] = 0
      }

      regionYearTotals[yearKey][region] += value
    })

    // Calculate total across all regions for percentage
    const yearTotals: Record<string, number> = {}
    Object.entries(regionYearTotals).forEach(([year, regionData]) => {
      yearTotals[year] = Object.values(regionData).reduce((sum, val) => sum + val, 0)
    })

    const regionCountryPercentageChartData = Object.entries(regionYearTotals).flatMap(([year, regionData]) => {
      const totalForYear = yearTotals[year]

      return Object.entries(regionData).map(([region, value]) => {
        const percentage = totalForYear > 0 ? ((value / totalForYear) * 100) : 0

        return {
          year: Number(year),
          region,
          country: region, // Use region as country for compatibility with the chart component
          value: filters.marketEvaluation === 'By Volume' ? value : percentage,
          yearRegion: `${year} - ${region}`
        }
      })
    })

    // Generate year-wise stacked bar chart data for share analysis
    const bladeMaterialStackedData = generateYearWiseStackedBarData(
      (d) => d.bladeMaterial || '',
      filters.bladeMaterial.length > 0 ? filters.bladeMaterial : undefined
    )
    const handleLengthStackedData = generateYearWiseStackedBarData(
      (d) => d.handleLength || '',
      filters.handleLength.length > 0 ? filters.handleLength : undefined
    )
    const applicationStackedData = generateYearWiseStackedBarData(
      (d) => d.application || '',
      filters.application.length > 0 ? filters.application : undefined
    )
    const endUserStackedData = generateYearWiseStackedBarData(
      (d) => d.endUser || '',
      filters.endUser.length > 0 ? filters.endUser : undefined
    )

    // Generate distribution channel type stacked bar chart data (Online vs Offline)
    const distributionChannelTypeStackedData = generateYearWiseStackedBarData(
      (d) => d.distributionChannelType || '',
      filters.distributionChannelType.length > 0 ? filters.distributionChannelType : undefined
    )

    // Generate distribution channel subtype stacked bar chart data
    // Only show if a distribution channel type is selected
    let offlineChannelStackedData: { chartData: Array<Record<string, number | string>>; segments: string[] } = { chartData: [], segments: [] }
    let onlineChannelStackedData: { chartData: Array<Record<string, number | string>>; segments: string[] } = { chartData: [], segments: [] }
    
    if (filters.distributionChannelType.length > 0) {
      // Filter data for offline channels
      if (filters.distributionChannelType.includes('Offline')) {
        const offlineData = filteredData.filter(d => d.distributionChannelType === 'Offline')
        const offlineChannels = [...new Set(offlineData.map(d => d.distributionChannel))].filter(Boolean).sort() as string[]
        
        const yearChannelMap = new Map<number, Map<string, number>>()
        offlineData.forEach(d => {
          const year = d.year
          const channel = d.distributionChannel
          if (channel) {
            if (!yearChannelMap.has(year)) {
              yearChannelMap.set(year, new Map<string, number>())
            }
            const channelMap = yearChannelMap.get(year)!
            channelMap.set(channel, (channelMap.get(channel) || 0) + getDataValue(d))
          }
        })
        
        const chartData = years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const channelMap = yearChannelMap.get(year) || new Map<string, number>()
          offlineChannels.forEach(channel => {
            entry[channel] = channelMap.get(channel) || 0
          })
          return entry
        })
        
        const activeChannels = offlineChannels.filter(channel => 
          chartData.some(entry => (entry[channel] as number) > 0)
        )
        
        offlineChannelStackedData = { chartData, segments: activeChannels }
      }
      
      // Filter data for online channels
      if (filters.distributionChannelType.includes('Online')) {
        const onlineData = filteredData.filter(d => d.distributionChannelType === 'Online')
        const onlineChannels = [...new Set(onlineData.map(d => d.distributionChannel))].filter(Boolean).sort() as string[]
        
        const yearChannelMap = new Map<number, Map<string, number>>()
        onlineData.forEach(d => {
          const year = d.year
          const channel = d.distributionChannel
          if (channel) {
            if (!yearChannelMap.has(year)) {
              yearChannelMap.set(year, new Map<string, number>())
            }
            const channelMap = yearChannelMap.get(year)!
            channelMap.set(channel, (channelMap.get(channel) || 0) + getDataValue(d))
          }
        })
        
        const chartData = years.map(year => {
          const entry: Record<string, number | string> = { year: String(year) }
          const channelMap = yearChannelMap.get(year) || new Map<string, number>()
          onlineChannels.forEach(channel => {
            entry[channel] = channelMap.get(channel) || 0
          })
          return entry
        })
        
        const activeChannels = onlineChannels.filter(channel => 
          chartData.some(entry => (entry[channel] as number) > 0)
        )
        
        onlineChannelStackedData = { chartData, segments: activeChannels }
      }
    }

    return {
      productCategoryChartData: productCategoryData.chartData,
      subProductCategoryChartData: subProductCategoryData.chartData,
      productTypeChartData: productTypeData.chartData,
      bladeMaterialChartData: bladeMaterialData.chartData,
      handleLengthChartData: handleLengthData.chartData,
      applicationChartData: applicationData.chartData,
      endUserChartData: endUserData.chartData,
      countryChartData,
      regionCountryPercentageChartData,
      productCategories: productCategoryData.segments,
      subProductCategories: subProductCategoryData.segments,
      productTypes: productTypeData.segments,
      bladeMaterials: bladeMaterialData.segments,
      handleLengths: handleLengthData.segments,
      applications: applicationData.segments,
      endUsers: endUserData.segments,
      countries: regionsForChart,
      regionsForChart,
      // Year-wise stacked bar chart data for share analysis
      bladeMaterialStackedData,
      handleLengthStackedData,
      applicationStackedData,
      endUserStackedData,
      distributionChannelTypeStackedData,
      offlineChannelStackedData,
      onlineChannelStackedData,
    }
  }, [filteredData, filters.marketEvaluation, filters.productCategory, filters.subProductCategory, filters.productType, filters.bladeMaterial, filters.handleLength, filters.application, filters.endUser, filters.country, filters.distributionChannelType])

  // KPI Stats - Generate based on selected filters using demo data
  const kpis = useMemo(() => {
    // Base market values by country (in millions USD)
    const countryBaseValues: Record<string, number> = {
      'US': 4500,
      'Germany': 1800,
      'China': 3800,
      'Japan': 2200
    }

    // Get selected countries or use all
    const selectedCountries = filters.country.length > 0 ? filters.country : ['US', 'Germany', 'China', 'Japan']

    // Get selected years or use default (latest year 2032 for total market size)
    const selectedYears = filters.year.length > 0 ? filters.year : [2032]
    const latestYear = Math.max(...selectedYears)

    // Calculate year multiplier (6.5% annual growth from 2024)
    const yearGrowthRate = 1.065
    const yearMultiplier = Math.pow(yearGrowthRate, latestYear - 2024)

    // Calculate total market value based on selected countries
    let totalValue = selectedCountries.reduce((sum, country) => {
      return sum + (countryBaseValues[country] || 2000)
    }, 0) * yearMultiplier

    // Apply filter multipliers for product type selections
    if (filters.productType.length > 0 && filters.productType.length < 6) {
      totalValue *= (filters.productType.length / 6) * 1.1
    }

    // Apply filter multipliers for other selections
    if (filters.technology.length > 0 && filters.technology.length < 4) {
      totalValue *= 0.85
    }
    if (filters.distributionChannel.length > 0 && filters.distributionChannel.length < 4) {
      totalValue *= 0.75
    }

    return {
      totalValue: filters.marketEvaluation === 'By Volume'
        ? `${formatWithCommas(totalValue * 0.8, 1)}K Units`
        : `$${formatWithCommas(totalValue, 1)}M`,
    }
  }, [filters.country, filters.year, filters.productType, filters.technology, filters.distributionChannel, filters.marketEvaluation])

  // Get unique options for incremental filters
  const incrementalFilterOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        regions: [],
        productTypes: [],
        countries: [],
      }
    }
    
    const regionSet = new Set<string>()
    const productTypeSet = new Set<string>()
    const countrySet = new Set<string>()
    
    data.forEach(d => {
      if (d.region) regionSet.add(d.region)
      if (d.productType) productTypeSet.add(d.productType)
      if (d.country) countrySet.add(d.country)
    })
    
    return {
      regions: Array.from(regionSet).sort(),
      productTypes: Array.from(productTypeSet).sort(),
      countries: Array.from(countrySet).sort(),
    }
  }, [data])

  // Filter data for incremental chart
  const filteredIncrementalData = useMemo(() => {
    let filtered = [...data]

    // Filter by country
    if (incrementalFilters.country.length > 0) {
      filtered = filtered.filter(d => incrementalFilters.country.includes(d.country))
    }

    // Filter by hierarchical product type
    if (incrementalFilters.productType.length > 0) {
      filtered = filtered.filter(d => {
        // Check if any selected filter matches
        return incrementalFilters.productType.some(selected => {
          // Check for exact match with main category
          if (selected === d.productCategory || selected === d.productType) {
            return true
          }
          // Check for subcategory match (format: "MainCategory - SubCategory")
          if (selected.includes(' - ')) {
            const [mainCat, subCat] = selected.split(' - ')
            return d.productCategory === mainCat && d.subProductCategory === subCat
          }
          // Check if the data's product type starts with the selected category
          if (d.productType && d.productType.startsWith(selected)) {
            return true
          }
          return false
        })
      })
    }

    return filtered
  }, [data, incrementalFilters])

  // Waterfall Chart Data (Incremental Opportunity) - based on filters
  const waterfallData = useMemo(() => {
    // Demo data configuration based on filters
    const countryMultipliers: Record<string, number> = {
      'US': 1.0,
      'Germany': 0.35,
      'China': 0.85,
      'Japan': 0.45
    }

    const productTypeMultipliers: Record<string, number> = {
      'Foil Shavers': 0.25,
      'Rotary Shavers': 0.20,
      'Trimmers & Groomers': 0.18,
      'Hybrid Shavers': 0.12,
      'Lady Shavers': 0.10,
      'Hair Clippers': 0.15
    }

    // Calculate multiplier based on selected filters
    let filterMultiplier = 1.0

    if (incrementalFilters.country.length > 0) {
      filterMultiplier = incrementalFilters.country.reduce((sum, country) => {
        return sum + (countryMultipliers[country] || 0.25)
      }, 0) / (incrementalFilters.country.length > 1 ? 1 : 1)
    }

    if (incrementalFilters.productType.length > 0) {
      // Get unique main categories from selected product types
      const mainCategories = new Set<string>()
      incrementalFilters.productType.forEach(pt => {
        if (pt.includes(' - ')) {
          mainCategories.add(pt.split(' - ')[0])
        } else {
          mainCategories.add(pt)
        }
      })

      const productMultiplier = Array.from(mainCategories).reduce((sum, cat) => {
        return sum + (productTypeMultipliers[cat] || 0.1)
      }, 0)

      filterMultiplier *= productMultiplier
    }

    // Default base values
    const defaultBaseValue = 57159
    const defaultIncrements = [2638.4, 2850.4, 3055.6, 3231.0, 3432.9, 3674.2, 3885.1]

    // Calculate base value from 2024 data
    const baseYearData = filteredIncrementalData.filter(d => d.year === 2024)
    let baseValue = baseYearData.reduce((sum, d) => sum + (d.marketValueUsd || 0) / 1000, 0)

    // If no data, use demo data with filter multiplier
    if (baseValue === 0) {
      baseValue = defaultBaseValue * filterMultiplier
    }

    // Calculate incremental values for each year
    const incrementalValues = []
    for (let year = 2025; year <= 2031; year++) {
      const yearData = filteredIncrementalData.filter(d => d.year === year)
      const prevYearData = filteredIncrementalData.filter(d => d.year === year - 1)

      const yearValue = yearData.reduce((sum, d) => sum + (d.marketValueUsd || 0) / 1000, 0)
      const prevYearValue = prevYearData.reduce((sum, d) => sum + (d.marketValueUsd || 0) / 1000, 0)

      let incremental: number
      if (yearValue > 0 && prevYearValue > 0) {
        incremental = yearValue - prevYearValue
      } else {
        // Use demo data scaled by filter multiplier
        incremental = defaultIncrements[year - 2025] * filterMultiplier
      }

      incrementalValues.push({ year: String(year), value: incremental })
    }

    let cumulative = baseValue
    const chartData = [
      { year: '2024', baseValue, totalValue: baseValue, isBase: true },
      ...incrementalValues.map(item => {
        cumulative += item.value
        return {
          year: item.year,
          incrementalValue: item.value,
          totalValue: cumulative,
        }
      }),
      { year: '2032', baseValue: cumulative, totalValue: cumulative, isTotal: true },
    ]

    const totalIncremental = incrementalValues.reduce((sum, item) => sum + item.value, 0)

    return { chartData, incrementalOpportunity: totalIncremental }
  }, [filteredIncrementalData, incrementalFilters])

  // Get unique options for attractiveness filters
  const attractivenessFilterOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        regions: [],
        productTypes: [],
      }
    }
    
    const regionSet = new Set<string>()
    const productTypeSet = new Set<string>()
    
    data.forEach(d => {
      if (d.region) regionSet.add(d.region)
      if (d.productType) productTypeSet.add(d.productType)
    })
    
    return {
      regions: Array.from(regionSet).sort(),
      productTypes: Array.from(productTypeSet).sort(),
    }
  }, [data])

  // Filter data for attractiveness chart
  const filteredAttractivenessData = useMemo(() => {
    let filtered = [...data]

    // Filter by year range 2025-2032
    filtered = filtered.filter(d => d.year >= 2025 && d.year <= 2032)

    // Filter by country
    if (attractivenessFilters.country.length > 0) {
      filtered = filtered.filter(d => attractivenessFilters.country.includes(d.country || d.region))
    }

    if (attractivenessFilters.region.length > 0) {
      filtered = filtered.filter(d => attractivenessFilters.region.includes(d.region))
    }
    if (attractivenessFilters.productType.length > 0) {
      filtered = filtered.filter(d => attractivenessFilters.productType.includes(d.productType))
    }

    return filtered
  }, [data, attractivenessFilters])

  // Bubble Chart Data (Market Attractiveness) - based on filters
  const bubbleChartData = useMemo(() => {
    // Define segment data configurations
    const segmentConfigs: Record<string, { items: string[]; values: Record<string, { cagr: number; share: number; opp: number }> }> = {
      productType: {
        items: ['Foil Shavers', 'Rotary Shavers', 'Trimmers & Groomers', 'Hybrid Shavers', 'Lady Shavers', 'Hair Clippers'],
        values: {
          'Foil Shavers': { cagr: 4.2, share: 12.5, opp: 9500 },
          'Rotary Shavers': { cagr: 6.8, share: 9.8, opp: 7800 },
          'Trimmers & Groomers': { cagr: 9.5, share: 7.2, opp: 8200 },
          'Hybrid Shavers': { cagr: 11.2, share: 3.5, opp: 5500 },
          'Lady Shavers': { cagr: 7.5, share: 5.8, opp: 4200 },
          'Hair Clippers': { cagr: 3.5, share: 15.2, opp: 6100 },
        }
      },
      technology: {
        items: ['Corded', 'Cordless / Rechargeable', 'Li-ion battery', 'NiMH battery'],
        values: {
          'Corded': { cagr: 3.5, share: 12.5, opp: 3200 },
          'Cordless / Rechargeable': { cagr: 8.2, share: 9.5, opp: 12500 },
          'Li-ion battery': { cagr: 9.5, share: 6.8, opp: 10800 },
          'NiMH battery': { cagr: 5.8, share: 10.2, opp: 2800 },
        }
      },
      bladeType: {
        items: ['Stainless Steel Blades', 'Titanium-coated Blades', 'Carbon Steel', 'Ceramic Blades', 'Self-sharpening Blades'],
        values: {
          'Stainless Steel Blades': { cagr: 4.2, share: 13.5, opp: 9200 },
          'Titanium-coated Blades': { cagr: 7.5, share: 10.2, opp: 7500 },
          'Carbon Steel': { cagr: 5.5, share: 11.8, opp: 4100 },
          'Ceramic Blades': { cagr: 8.8, share: 6.5, opp: 4800 },
          'Self-sharpening Blades': { cagr: 10.2, share: 8.2, opp: 6500 },
        }
      },
      priceRange: {
        items: ['Economy', 'Mid-Range', 'Premium'],
        values: {
          'Economy': { cagr: 4.2, share: 12.5, opp: 5500 },
          'Mid-Range': { cagr: 6.8, share: 9.5, opp: 9800 },
          'Premium': { cagr: 9.5, share: 6.8, opp: 7200 },
        }
      },
      endUser: {
        items: ['Home Users', 'Professional Users', 'Men', 'Women', 'Barbers', 'Salons'],
        values: {
          'Home Users': { cagr: 4.2, share: 14.5, opp: 11200 },
          'Professional Users': { cagr: 8.5, share: 7.8, opp: 6800 },
          'Men': { cagr: 5.5, share: 12.2, opp: 8500 },
          'Women': { cagr: 7.2, share: 10.5, opp: 5200 },
          'Barbers': { cagr: 9.8, share: 5.2, opp: 4100 },
          'Salons': { cagr: 10.5, share: 8.5, opp: 4800 },
        }
      },
      distributionChannel: {
        items: ['Offline', 'Online', 'Supermarkets & Hypermarkets', 'Specialty Stores', 'E-commerce / Third Party Platforms'],
        values: {
          'Offline': { cagr: 3.5, share: 12.5, opp: 6800 },
          'Online': { cagr: 8.5, share: 8.2, opp: 9500 },
          'Supermarkets & Hypermarkets': { cagr: 4.8, share: 10.5, opp: 4500 },
          'Specialty Stores': { cagr: 6.2, share: 9.2, opp: 5200 },
          'E-commerce / Third Party Platforms': { cagr: 9.8, share: 6.5, opp: 8200 },
        }
      },
    }

    // Country-based multipliers
    const countryMultipliers: Record<string, number> = {
      'US': 1.0,
      'Germany': 0.65,
      'China': 0.95,
      'Japan': 0.75
    }

    // Default country data
    const defaultCountryData: Record<string, { cagr: number; share: number; opp: number }> = {
      'US': { cagr: 5.8, share: 8.5, opp: 12500 },
      'Germany': { cagr: 4.5, share: 5.2, opp: 6800 },
      'China': { cagr: 8.5, share: 9.2, opp: 15500 },
      'Japan': { cagr: 5.2, share: 6.8, opp: 8200 },
    }

    // Calculate country multiplier based on selected countries
    let countryMultiplier = 1.0
    if (attractivenessFilters.country.length > 0) {
      countryMultiplier = attractivenessFilters.country.reduce((sum, c) => sum + (countryMultipliers[c] || 0.5), 0) / attractivenessFilters.country.length
    }

    // Determine what to group by based on segment selection
    const selectedSegment = attractivenessFilters.segment

    if (selectedSegment && segmentConfigs[selectedSegment]) {
      // Generate bubble data based on selected segment
      const config = segmentConfigs[selectedSegment]
      return config.items.map(item => {
        const baseValues = config.values[item] || { cagr: 5.0, share: 5.0, opp: 5000 }
        return {
          region: item,
          cagrIndex: baseValues.cagr * countryMultiplier * (0.9 + Math.random() * 0.2),
          marketShareIndex: baseValues.share * countryMultiplier * (0.9 + Math.random() * 0.2),
          incrementalOpportunity: baseValues.opp * countryMultiplier * (0.9 + Math.random() * 0.2),
        }
      })
    }

    // Default: Show by country
    const countries = attractivenessFilters.country.length > 0
      ? attractivenessFilters.country
      : ['US', 'Germany', 'China', 'Japan']

    return countries.map(country => {
      const baseValues = defaultCountryData[country] || { cagr: 5.0, share: 5.0, opp: 5000 }
      return {
        region: country,
        cagrIndex: baseValues.cagr * (0.9 + Math.random() * 0.2),
        marketShareIndex: baseValues.share * (0.9 + Math.random() * 0.2),
        incrementalOpportunity: baseValues.opp * (0.9 + Math.random() * 0.2),
      }
    })
  }, [filteredAttractivenessData, attractivenessFilters])

  // Get unique options for YoY filters
  const yoyFilterOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        regions: [],
        productTypes: [],
        countries: [],
        countryOptions: [], // Options with region names
      }
    }
    
    const regionSet = new Set<string>()
    const productTypeSet = new Set<string>()
    const countryRegionMap = new Map<string, string>() // country -> region mapping
    
    data.forEach(d => {
      if (d.region) regionSet.add(d.region)
      if (d.productType) productTypeSet.add(d.productType)
      if (d.country && d.region) {
        countryRegionMap.set(d.country, d.region)
      }
    })
    
    // Filter countries based on selected regions
    let availableCountries = Array.from(countryRegionMap.keys())
    if (yoyFilters.region.length > 0) {
      availableCountries = availableCountries.filter(country => {
        const countryRegion = countryRegionMap.get(country)
        return countryRegion && yoyFilters.region.includes(countryRegion)
      })
    }
    
    // Create country options with region names
    const countryOptions = availableCountries
      .sort()
      .map(country => {
        const region = countryRegionMap.get(country) || ''
        return {
          value: country,
          label: `${country} (${region})`
        }
      })
    
    return {
      regions: Array.from(regionSet).sort(),
      productTypes: Array.from(productTypeSet).sort(),
      countries: availableCountries.sort(),
      countryOptions: countryOptions,
    }
  }, [data, yoyFilters.region])

  // Filter data for YoY/CAGR chart
  const filteredYoyData = useMemo(() => {
    let filtered = [...data]

    if (yoyFilters.region.length > 0) {
      filtered = filtered.filter(d => yoyFilters.region.includes(d.region))
    }
    if (yoyFilters.productType.length > 0) {
      filtered = filtered.filter(d => yoyFilters.productType.includes(d.productType))
    }
    if (yoyFilters.country.length > 0) {
      filtered = filtered.filter(d => yoyFilters.country.includes(d.country))
    }

    // Filter by distribution channel - include parent channel data when subfilters are selected
    if (yoyFilters.distributionChannel.length > 0) {
      const selectedChannels = yoyFilters.distributionChannel
      // Check if Offline or Online parent is selected, or any of their subfilters
      const offlineSubfilters = ['Supermarkets & Hypermarkets', 'Specialty Stores', 'Department Stores', 'Others']
      const onlineSubfilters = ['E-commerce / Third Party Platforms', 'Company Websites', 'Others']

      const hasOfflineParent = selectedChannels.includes('Offline')
      const hasOnlineParent = selectedChannels.includes('Online')
      const hasOfflineSubfilter = selectedChannels.some(c => c.startsWith('Offline - '))
      const hasOnlineSubfilter = selectedChannels.some(c => c.startsWith('Online - '))

      // Build list of all channels to include
      const channelsToInclude: string[] = []

      if (hasOfflineParent || hasOfflineSubfilter) {
        channelsToInclude.push('Offline')
        offlineSubfilters.forEach(sub => channelsToInclude.push(sub))
      }
      if (hasOnlineParent || hasOnlineSubfilter) {
        channelsToInclude.push('Online')
        onlineSubfilters.forEach(sub => channelsToInclude.push(sub))
      }

      // Filter based on distribution channel
      filtered = filtered.filter(d => {
        const channel = d.distributionChannel || ''
        return channelsToInclude.some(c => channel.toLowerCase().includes(c.toLowerCase()))
      })
    }

    return filtered
  }, [data, yoyFilters])

  // YoY/CAGR Chart Data - Generate separate data for each country (with demo data)
  const yoyCagrDataByEntity = useMemo(() => {
    // If no countries are selected, return empty array
    if (yoyFilters.country.length === 0) {
      return []
    }

    // Country-specific base growth rates
    const countryBaseRates: Record<string, { baseYoy: number, baseCagr: number }> = {
      'US': { baseYoy: 5.2, baseCagr: 4.8 },
      'Germany': { baseYoy: 4.5, baseCagr: 4.2 },
      'China': { baseYoy: 8.5, baseCagr: 7.8 },
      'Japan': { baseYoy: 3.8, baseCagr: 3.5 },
    }

    // Distribution channel multipliers
    const getChannelMultiplier = (): number => {
      if (yoyFilters.distributionChannel.length === 0) return 1.0

      const selectedChannels = yoyFilters.distributionChannel
      const hasOffline = selectedChannels.includes('Offline') || selectedChannels.some(c => c.startsWith('Offline - '))
      const hasOnline = selectedChannels.includes('Online') || selectedChannels.some(c => c.startsWith('Online - '))

      if (hasOnline && !hasOffline) {
        return 1.35 // Online has higher growth
      } else if (hasOffline && !hasOnline) {
        return 0.85 // Offline has lower growth
      }
      return 1.0 // Both selected
    }

    const channelMultiplier = getChannelMultiplier()

    // Generate label suffix based on distribution channel
    const getChannelLabel = (): string => {
      if (yoyFilters.distributionChannel.length === 0) return ''

      const selectedChannels = yoyFilters.distributionChannel
      const hasOffline = selectedChannels.includes('Offline') || selectedChannels.some(c => c.startsWith('Offline - '))
      const hasOnline = selectedChannels.includes('Online') || selectedChannels.some(c => c.startsWith('Online - '))

      if (hasOnline && hasOffline) {
        return ' - All Channels'
      } else if (hasOnline) {
        return ' - Online'
      } else if (hasOffline) {
        return ' - Offline'
      }
      return ''
    }

    const channelLabel = getChannelLabel()

    // Generate data for each selected country
    return yoyFilters.country.map(country => {
      const baseRates = countryBaseRates[country] || { baseYoy: 5.0, baseCagr: 4.5 }
      const years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']

      const chartData = years.map((year, index) => {
        // Add some variation per year
        const yearVariation = 1 + (Math.sin(index * 0.7) * 0.15)
        const randomVariation = 0.95 + Math.random() * 0.1

        const yoy = index === 0 ? 0 : baseRates.baseYoy * channelMultiplier * yearVariation * randomVariation
        const cagr = index === 0 ? 0 : baseRates.baseCagr * channelMultiplier * (1 + index * 0.02) * randomVariation

        return {
          year,
          yoy: Math.round(yoy * 100) / 100,
          cagr: Math.round(cagr * 100) / 100,
        }
      })

      return {
        label: `${country}${channelLabel}`,
        data: chartData
      }
    })
  }, [yoyFilters.country, yoyFilters.distributionChannel])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading market analysis data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('Home')}
          className="flex items-center gap-2 px-5 py-2.5 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>
      </div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <InfoTooltip content="• Provides insights into market size and volume analysis\n• Analyze data by market segments: Product Category, Blade Material, Handle Length, Application, End User\n• Use filters to explore market trends\n• Charts show market size (US$ Million) or volume (Units) by selected segments">
          <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3 cursor-help">
            Market Analysis
          </h1>
        </InfoTooltip>
        <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark">
          Market size and volume analysis by segments, regions, and years
        </p>
      </motion.div>

      {!data || data.length === 0 ? (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-4">
              No data available. Please check the data source.
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              If this issue persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs Section */}
          <div className={`p-6 rounded-2xl mb-6 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
            <div className="flex gap-4 border-b-2 border-gray-300 dark:border-navy-light">
              <button
                onClick={() => setActiveTab('standard')}
                className={`px-6 py-3 font-semibold text-base transition-all relative ${
                  activeTab === 'standard'
                    ? 'text-electric-blue dark:text-cyan-accent'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue dark:hover:text-cyan-accent'
                }`}
              >
                Market Size
                {activeTab === 'standard' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('incremental')}
                className={`px-6 py-3 font-semibold text-base transition-all relative ${
                  activeTab === 'incremental'
                    ? 'text-electric-blue dark:text-cyan-accent'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue dark:hover:text-cyan-accent'
                }`}
              >
                Incremental Opportunity
                {activeTab === 'incremental' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('attractiveness')}
                className={`px-6 py-3 font-semibold text-base transition-all relative ${
                  activeTab === 'attractiveness'
                    ? 'text-electric-blue dark:text-cyan-accent'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue dark:hover:text-cyan-accent'
                }`}
              >
                Market Attractiveness
                {activeTab === 'attractiveness' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('yoy')}
                className={`px-6 py-3 font-semibold text-base transition-all relative ${
                  activeTab === 'yoy'
                    ? 'text-electric-blue dark:text-cyan-accent'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue dark:hover:text-cyan-accent'
                }`}
              >
                Y-o-Y / CAGR Analysis
                {activeTab === 'yoy' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                )}
              </button>
            </div>
          </div>

          <DemoNotice />

          {/* Filters Section - Only for Standard Tab */}
          {activeTab === 'standard' && (
          <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'} relative`} style={{ overflow: 'visible' }}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Filter Data
                </h3>
              </div>
              <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
                Filter market data by various criteria.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterDropdown
                label="Year"
                value={filters.year.map(y => String(y))}
                onChange={(value) => setFilters({ ...filters, year: (value as string[]).map(v => Number(v)) })}
                options={uniqueOptions.years ? uniqueOptions.years.map(y => String(y)) : []}
              />
              <FilterDropdown
                label="By Country"
                value={filters.country}
                onChange={(value) => setFilters({ ...filters, country: value as string[] })}
                options={['US', 'Germany', 'China', 'Japan']}
              />
              <HierarchicalFilterDropdown
                label="By Product Type"
                value={filters.productType}
                onChange={(value) => setFilters({ ...filters, productType: value })}
                hierarchy={[
                  {
                    mainCategory: 'Foil Shavers',
                    subCategories: ['Single-foil', 'Dual-foil', 'Multi-foil (3+)']
                  },
                  {
                    mainCategory: 'Rotary Shavers',
                    subCategories: ['Dual-head', 'Triple-head', 'Multi-head (4+)']
                  },
                  {
                    mainCategory: 'Trimmers & Groomers',
                    subCategories: ['Beard trimmers', 'Body groomers', 'Others']
                  },
                  {
                    mainCategory: 'Hybrid Shavers',
                    subCategories: ['Blade-electric combo', 'Wet & dry hybrid tools']
                  },
                  {
                    mainCategory: 'Lady Shavers',
                    subCategories: ['Face shavers', 'Body shavers', 'Bikini trimmers']
                  },
                  {
                    mainCategory: 'Hair Clippers',
                    subCategories: ['Corded clippers', 'Cordless clippers', 'Others']
                  }
                ]}
              />
              <HierarchicalFilterDropdown
                label="By Technology"
                value={filters.technology}
                onChange={(value) => setFilters({ ...filters, technology: value })}
                hierarchy={[
                  {
                    mainCategory: 'Corded',
                    subCategories: []
                  },
                  {
                    mainCategory: 'Cordless / Rechargeable',
                    subCategories: ['Li-ion battery', 'NiMH battery']
                  }
                ]}
              />
              <FilterDropdown
                label="By Blade Type"
                value={filters.bladeType}
                onChange={(value) => setFilters({ ...filters, bladeType: value as string[] })}
                options={['Stainless Steel Blades', 'Titanium-coated Blades', 'Carbon Steel', 'Ceramic Blades', 'Self-sharpening Blades', 'Replaceable vs Non-replaceable Heads']}
              />
              <FilterDropdown
                label="By Price Range"
                value={filters.priceRange}
                onChange={(value) => setFilters({ ...filters, priceRange: value as string[] })}
                options={['Economy', 'Mid-Range', 'Premium']}
              />
              <HierarchicalFilterDropdown
                label="By End User"
                value={filters.endUser}
                onChange={(value) => setFilters({ ...filters, endUser: value })}
                hierarchy={[
                  {
                    mainCategory: 'Home Users',
                    subCategories: ['Men', 'Women', 'Unisex']
                  },
                  {
                    mainCategory: 'Professional Users',
                    subCategories: ['Barbers', 'Salons', 'Grooming service providers', 'Others']
                  }
                ]}
              />
              <HierarchicalFilterDropdown
                label="By Distribution Channel"
                value={filters.distributionChannel}
                onChange={(value) => setFilters({ ...filters, distributionChannel: value })}
                hierarchy={[
                  {
                    mainCategory: 'Offline',
                    subCategories: ['Supermarkets & Hypermarkets', 'Specialty Stores', 'Brand Retail Stores', 'Electronics Stores', 'Pharmacy/Drug Stores', 'Professional Supply Stores (Barber/salon suppliers)']
                  },
                  {
                    mainCategory: 'Online',
                    subCategories: ['E-commerce / Third Party Platforms', 'Company / Brand Websites']
                  }
                ]}
              />
            </div>

            {/* Active Filters Display */}
            {(filters.year.length > 0 || filters.productType.length > 0 || filters.country.length > 0) && (
              <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-navy-light">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-navy-dark' : 'bg-blue-50'}`}>
                  <p className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                    Currently Viewing:
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Year:</span>
                      <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">
                        {filters.year.length > 0 ? filters.year.join(', ') : 'All Years'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Product Type:</span>
                      <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">
                        {filters.productType.length > 0 ? filters.productType.join(', ') : 'All'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Country:</span>
                      <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">
                        {filters.country.length > 0 ? filters.country.join(', ') : 'All Countries'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Evaluation:</span>
                      <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">
                        {filters.marketEvaluation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Tab Content */}
          {activeTab === 'standard' && (
            <>
              {/* KPI Cards */}
              <div className="mb-10">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      Key Metrics
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className={`p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <StatBox
                      title={kpis.totalValue}
                      subtitle={`Total ${filters.marketEvaluation === 'By Volume' ? 'Volume' : 'Market Size'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Graph 1: Market Size by Product Type */}
          {analysisData.productTypeChartData.length > 0 && analysisData.productTypes && analysisData.productTypes.length > 0 && (
            <div className="mb-20">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                  <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} by product type grouped by year\n• X-axis: Year\n• Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Compare product type performance across years`}>
                    <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                      {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'} by Product Type
                    </h2>
                  </InfoTooltip>
                </div>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  Product type performance comparison by year
                </p>
              </div>
              <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                  <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                    {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'} by Product Type by Year
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {getDataLabel()}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                  <SegmentGroupedBarChart
                    data={analysisData.productTypeChartData}
                    segmentKeys={analysisData.productTypes}
                    xAxisLabel="Year"
                    yAxisLabel={getDataLabel()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Share Analysis Section - Year-wise Stacked Bar Charts */}
          {((analysisData.bladeMaterialStackedData.chartData.length > 0 && analysisData.bladeMaterialStackedData.segments.length > 0) ||
            (analysisData.handleLengthStackedData.chartData.length > 0 && analysisData.handleLengthStackedData.segments.length > 0) ||
            (analysisData.applicationStackedData.chartData.length > 0 && analysisData.applicationStackedData.segments.length > 0) ||
            (analysisData.endUserStackedData.chartData.length > 0 && analysisData.endUserStackedData.segments.length > 0) ||
            (analysisData.distributionChannelTypeStackedData.chartData.length > 0 && analysisData.distributionChannelTypeStackedData.segments.length > 0) ||
            (analysisData.offlineChannelStackedData.chartData.length > 0 && analysisData.offlineChannelStackedData.segments.length > 0) ||
            (analysisData.onlineChannelStackedData.chartData.length > 0 && analysisData.onlineChannelStackedData.segments.length > 0)) && (
            <div className="mb-20">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                  <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share across different segments by year\n• Each stacked bar represents a year with segments showing the proportion\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Hover over bars to see detailed values and percentages`}>
                    <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                      {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'} Analysis by Segments
                    </h2>
                  </InfoTooltip>
                </div>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  Year-wise share breakdown (no summation across years)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blade Type Stacked Bar Chart */}
                {analysisData.bladeMaterialStackedData.chartData.length > 0 && analysisData.bladeMaterialStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by blade type by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Blade Type Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.bladeMaterialStackedData.chartData}
                        dataKeys={analysisData.bladeMaterialStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* Price Range Stacked Bar Chart */}
                {analysisData.handleLengthStackedData.chartData.length > 0 && analysisData.handleLengthStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by price range by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Price Range Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.handleLengthStackedData.chartData}
                        dataKeys={analysisData.handleLengthStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* Technology Stacked Bar Chart */}
                {analysisData.applicationStackedData.chartData.length > 0 && analysisData.applicationStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by technology by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Technology Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.applicationStackedData.chartData}
                        dataKeys={analysisData.applicationStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* End User Stacked Bar Chart */}
                {analysisData.endUserStackedData.chartData.length > 0 && analysisData.endUserStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by end user by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          End User Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.endUserStackedData.chartData}
                        dataKeys={analysisData.endUserStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* Distribution Channel Type Stacked Bar Chart */}
                {analysisData.distributionChannelTypeStackedData.chartData.length > 0 && analysisData.distributionChannelTypeStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by distribution channel type by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Distribution Channel Type Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.distributionChannelTypeStackedData.chartData}
                        dataKeys={analysisData.distributionChannelTypeStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* Offline Channel Subtype Stacked Bar Chart - Only show if Offline type is selected */}
                {analysisData.offlineChannelStackedData.chartData.length > 0 && analysisData.offlineChannelStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by offline distribution channel subtypes by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Offline Channel Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.offlineChannelStackedData.chartData}
                        dataKeys={analysisData.offlineChannelStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}

                {/* Online Channel Subtype Stacked Bar Chart - Only show if Online type is selected */}
                {analysisData.onlineChannelStackedData.chartData.length > 0 && analysisData.onlineChannelStackedData.segments.length > 0 && (
                  <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[480px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-navy-light">
                      <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} share by online distribution channel subtypes by year\n• X-axis: Year, Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Each stacked bar shows the proportion for that year\n• Hover over bars to see detailed values and percentages`}>
                        <h3 className="text-base font-bold text-electric-blue dark:text-cyan-accent mb-1 cursor-help">
                          Online Channel Share
                        </h3>
                      </InfoTooltip>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {getDataLabel()}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <CrossSegmentStackedBarChart
                        data={analysisData.onlineChannelStackedData.chartData}
                        dataKeys={analysisData.onlineChannelStackedData.segments}
                        xAxisLabel="Year"
                        yAxisLabel={getDataLabel()}
                        nameKey="year"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Graph 6: Market Size by Region */}
          {analysisData.countryChartData.length > 0 && analysisData.regionsForChart && analysisData.regionsForChart.length > 0 && (
            <div className="mb-20">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                  <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market size'} by region grouped by year\n• X-axis: Year\n• Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'}\n• Compare region performance across years`}>
                    <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                      {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'} by Region by Year
                    </h2>
                  </InfoTooltip>
                </div>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  Region-wise breakdown grouped by year
                </p>
              </div>
              <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                  <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                    {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Size'} by Region by Year
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {getDataLabel()}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                  <SegmentGroupedBarChart
                    data={analysisData.countryChartData}
                    segmentKeys={analysisData.regionsForChart}
                    xAxisLabel="Year"
                    yAxisLabel={getDataLabel()}
                  />
                </div>
              </div>
            </div>
          )}

            </>
          )}

          {/* Incremental Opportunity Tab */}
          {activeTab === 'incremental' && (
            <>
              {/* Filters Section for Incremental Tab */}
              <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'} relative`} style={{ overflow: 'visible' }}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      Filter Data
                    </h3>
                  </div>
                  <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
                    Filter incremental opportunity data by region and product type.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterDropdown
                    label="By Country"
                    value={incrementalFilters.country}
                    onChange={(value) => setIncrementalFilters({ ...incrementalFilters, country: value as string[] })}
                    options={['US', 'Germany', 'China', 'Japan']}
                  />
                  <HierarchicalFilterDropdown
                    label="By Product Type"
                    value={incrementalFilters.productType}
                    onChange={(value) => setIncrementalFilters({ ...incrementalFilters, productType: value })}
                    hierarchy={[
                      {
                        mainCategory: 'Foil Shavers',
                        subCategories: ['Single-foil', 'Dual-foil', 'Multi-foil (3+)']
                      },
                      {
                        mainCategory: 'Rotary Shavers',
                        subCategories: ['Dual-head', 'Triple-head', 'Multi-head (4+)']
                      },
                      {
                        mainCategory: 'Trimmers & Groomers',
                        subCategories: ['Beard trimmers', 'Body groomers', 'Others']
                      },
                      {
                        mainCategory: 'Hybrid Shavers',
                        subCategories: ['Blade-electric combo', 'Wet & dry hybrid tools']
                      },
                      {
                        mainCategory: 'Lady Shavers',
                        subCategories: ['Face shavers', 'Body shavers', 'Bikini trimmers']
                      },
                      {
                        mainCategory: 'Hair Clippers',
                        subCategories: ['Corded clippers', 'Cordless clippers', 'Others']
                      }
                    ]}
                  />
                </div>
              </div>

              <div className="mb-20">
                <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[600px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                  <div className="flex-1 flex items-center justify-center min-h-0">
                    <WaterfallChart
                      data={waterfallData.chartData}
                      xAxisLabel="Incremental $ Opportunity"
                      yAxisLabel="Market Value (US$ Mn)"
                      incrementalOpportunity={waterfallData.incrementalOpportunity}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Market Attractiveness Tab */}
          {activeTab === 'attractiveness' && (
            <>
              {/* Filters Section for Attractiveness Tab */}
              <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'} relative`} style={{ overflow: 'visible' }}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      Filter Data
                    </h3>
                  </div>
                  <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
                    Filter market attractiveness data by country and segment (2025-2032).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterDropdown
                    label="By Country"
                    value={attractivenessFilters.country}
                    onChange={(value) => setAttractivenessFilters({ ...attractivenessFilters, country: value as string[] })}
                    options={['US', 'Germany', 'China', 'Japan']}
                  />
                  <div className="relative">
                    <label className="block text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                      By Segment
                    </label>
                    <select
                      value={attractivenessFilters.segment}
                      onChange={(e) => setAttractivenessFilters({ ...attractivenessFilters, segment: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-electric-blue dark:focus:ring-cyan-accent transition-all ${
                        isDark
                          ? 'bg-navy-dark border-navy-light text-text-primary-dark'
                          : 'bg-white border-gray-300 text-text-primary-light'
                      }`}
                    >
                      <option value="productType">By Product Type</option>
                      <option value="technology">By Technology</option>
                      <option value="bladeType">By Blade Type</option>
                      <option value="priceRange">By Price Range</option>
                      <option value="endUser">By End User</option>
                      <option value="distributionChannel">By Distribution Channel</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-20">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <InfoTooltip content="• Shows market attractiveness by selected segment from 2025 to 2032\n• X-axis: CAGR Index (Compound Annual Growth Rate)\n• Y-axis: Market Share Index\n• Bubble size indicates incremental opportunity\n• Larger bubbles represent greater market potential">
                      <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                        Market Attractiveness, {attractivenessFilters.segment ? `By ${
                          attractivenessFilters.segment === 'productType' ? 'Product Type' :
                          attractivenessFilters.segment === 'technology' ? 'Technology' :
                          attractivenessFilters.segment === 'bladeType' ? 'Blade Type' :
                          attractivenessFilters.segment === 'priceRange' ? 'Price Range' :
                          attractivenessFilters.segment === 'endUser' ? 'End User' :
                          attractivenessFilters.segment === 'distributionChannel' ? 'Distribution Channel' : 'Segment'
                        }` : 'By Country'}, 2025-2032
                      </h2>
                    </InfoTooltip>
                  </div>
                  <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                    Market attractiveness analysis by CAGR and Market Share Index
                    {attractivenessFilters.country.length > 0 && ` for ${attractivenessFilters.country.join(', ')}`}
                  </p>
                </div>
                <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[600px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                    <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                      Market Attractiveness Analysis
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      CAGR Index vs Market Share Index
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                    <BubbleChart
                      data={bubbleChartData}
                      xAxisLabel="CAGR Index"
                      yAxisLabel="Market Share Index"
                    />
                  </div>
                  {/* Segment Legend - Minimal horizontal style */}
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3">
                    {bubbleChartData.map((item, index) => {
                      const colors = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#EF4444', '#84CC16']
                      return (
                        <div key={index} className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="text-xs text-text-primary-light dark:text-text-primary-dark whitespace-nowrap">
                            {item.region}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* YoY / CAGR Analysis Tab */}
          {activeTab === 'yoy' && (
            <>
              {/* Filters Section for YoY/CAGR Tab */}
              <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'} relative`} style={{ overflow: 'visible' }}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      Filter Data
                    </h3>
                  </div>
                  <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
                    Filter YoY and CAGR analysis data by country and distribution channel.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterDropdown
                    label="By Country"
                    value={yoyFilters.country}
                    onChange={(value) => {
                      const newCountries = value as string[]
                      setYoyFilters({ ...yoyFilters, country: newCountries })
                    }}
                    options={['US', 'Germany', 'China', 'Japan']}
                  />
                  <HierarchicalFilterDropdown
                    label="By Distribution Channel"
                    value={yoyFilters.distributionChannel}
                    onChange={(value) => setYoyFilters({ ...yoyFilters, distributionChannel: value })}
                    hierarchy={[
                      {
                        mainCategory: 'Offline',
                        subCategories: ['Supermarkets & Hypermarkets', 'Specialty Stores', 'Department Stores', 'Others']
                      },
                      {
                        mainCategory: 'Online',
                        subCategories: ['E-commerce / Third Party Platforms', 'Company Websites', 'Others']
                      }
                    ]}
                  />
                </div>
              </div>

              <div className="mb-20">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                    <InfoTooltip content="• Shows Year-over-Year (Y-o-Y) growth rate and Compound Annual Growth Rate (CAGR)\n• Toggle between Y-o-Y and CAGR views using the button\n• Y-o-Y shows year-to-year growth percentage\n• CAGR shows cumulative annual growth rate from the first year\n• Select regions to generate separate charts for each (no summation)\n• Use filters to analyze specific regions and product types">
                      <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                        Year-over-Year (Y-o-Y) & CAGR Analysis
                      </h2>
                    </InfoTooltip>
                  </div>
                  <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                    Growth rate analysis with toggle between Y-o-Y and CAGR metrics. Separate charts for each selected country.
                  </p>
                </div>

                {yoyCagrDataByEntity.length === 0 ? (
                  <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                    <div className="flex items-center justify-center h-[400px]">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
                        Please select at least one country to view the analysis
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {yoyCagrDataByEntity.map((entity, index) => (
                      <div key={index} className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[600px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                          <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                            {entity.label}
                          </h3>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Toggle between Y-o-Y and CAGR views
                          </p>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                          <YoYCAGRChart
                            data={entity.data}
                            xAxisLabel="Year"
                            yAxisLabel="Growth Rate (%)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
