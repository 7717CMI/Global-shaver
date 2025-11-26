interface ShovelMarketData {
  recordId: number
  year: number
  region: string
  country: string
  productCategory: string
  subProductCategory: string
  productType: string // Kept for backward compatibility
  bladeMaterial: string
  handleLength: string
  application: string
  endUser: string
  distributionChannelType: string
  distributionChannel: string
  brand: string
  company: string
  price: number
  volumeUnits: number
  qty: number
  revenue: number
  marketValueUsd: number
  value: number
  marketSharePct: number
  cagr: number
  yoyGrowth: number
}

const generateComprehensiveData = (): ShovelMarketData[] => {
  const years = Array.from({ length: 15 }, (_, i) => 2021 + i)
  const regions = ["Northeast", "Midwest", "South", "West"]

  // Product categories and their subcategories for U.S. Water Repair Products Market
  const productCategories = {
    "Pipe Repair & Connection Products": [
      "Repair Clamps",
      "Repair Sleeves",
      "Wide-Range Couplings",
      "Transition Couplings",
      "Flange Adapters"
    ],
    "Restraint Couplings": [
      "Service Line Products",
      "Service Saddles",
      "Tapping Sleeves"
    ],
    "Corporation Stops": [],
    "Curb Valves & Boxes": [],
    "Valve Solutions": [
      "Gate Valves",
      "Butterfly Valves",
      "Insertion Valves",
      "Check Valves"
    ],
    "Hydrants & Flow Control": [
      "Fire Hydrants",
      "Hydrant Repair Kits"
    ],
    "Others (Leak Detection & Condition Assessment)": [
      "Acoustic Leak Detection Systems",
      "Smart Monitoring Sensors",
      "Pipe Condition Assessment Tools"
    ]
  }

  // Flatten for iteration
  const productTypesList: Array<{ category: string; subCategory: string }> = []
  Object.entries(productCategories).forEach(([category, subCategories]) => {
    if (subCategories.length === 0) {
      // For categories without subcategories, use the category name as subcategory
      productTypesList.push({ category, subCategory: category })
    } else {
      subCategories.forEach(subCategory => {
        productTypesList.push({ category, subCategory })
      })
    }
  })
  
  // Pipe Material Compatibility
  const bladeMaterials = [
    "Ductile Iron",
    "Cast Iron",
    "PVC",
    "HDPE",
    "Steel",
    "Concrete / Asbestos Cement"
  ]

  // Applications
  const handleLengths = ["Mass", "Premium", "Luxury"] // Price Range placeholder

  // Application categories
  const applications = [
    "Potable Water Distribution",
    "Wastewater / Sewer Lines",
    "Emergency Leak Repair",
    "Planned Rehabilitation / Retrofits",
    "New Installation & Expansion Projects",
    "Industrial Water Lines",
    "Agricultural / Irrigation Lines",
    "Others"
  ]

  // End User categories
  const professions = [
    "Municipal Water Utilities",
    "Private Water Utilities",
    "Public Works Departments",
    "Civil & Water Infrastructure Contractors",
    "Industrial Facilities",
    "Commercial Plumbing Contractors",
    "Distributors & Waterworks Wholesalers",
    "Others"
  ]
  
  // Distribution Channel categories
  const salesChannels = [
    "Direct Sales",
    "Distributor / Wholesaler Network",
    "Online Procurement Platforms",
    "Federal & Infrastructure-Funded Projects"
  ]

  const distributionChannelTypes = ["Offline", "Online"]
  const offlineChannels = ["Direct Sales", "Distributor Network", "Federal Projects"]
  const onlineChannels = ["Online Procurement Platforms", "E-commerce"]
  
  const brands = [
    "Mueller", "Smith-Blair", "Romac", "Dresser", "Ford Meter Box",
    "American Flow Control", "Mueller Systems", "Echologics", "JCM Industries", "Krausz"
  ]

  const companies = [
    "Mueller Water Products", "Smith-Blair Inc", "Romac Industries", "Dresser Utility Solutions", "Ford Meter Box Company",
    "American Flow Control (AFC)", "Mueller Systems", "Echologics (Mueller)", "JCM Industries", "Krausz USA"
  ]
  
  const countryMap: Record<string, string[]> = {
    'Northeast': ['New York', 'Pennsylvania', 'Massachusetts', 'New Jersey', 'Connecticut', 'Maine'],
    'Midwest': ['Illinois', 'Ohio', 'Michigan', 'Wisconsin', 'Minnesota', 'Indiana'],
    'South': ['Texas', 'Florida', 'Georgia', 'North Carolina', 'Virginia', 'Tennessee'],
    'West': ['California', 'Washington', 'Oregon', 'Colorado', 'Arizona', 'Nevada']
  }
  
  // Product category multipliers for variation
  const productCategoryMultipliers: Record<string, { price: number; volume: number; cagr: number }> = {
    'Pipe Repair & Connection Products': { price: 1.0, volume: 1.3, cagr: 1.2 },
    'Restraint Couplings': { price: 1.1, volume: 1.1, cagr: 1.1 },
    'Corporation Stops': { price: 0.9, volume: 1.2, cagr: 1.0 },
    'Curb Valves & Boxes': { price: 0.95, volume: 1.15, cagr: 1.05 },
    'Valve Solutions': { price: 1.2, volume: 1.0, cagr: 1.15 },
    'Hydrants & Flow Control': { price: 1.3, volume: 0.9, cagr: 1.1 },
    'Others (Leak Detection & Condition Assessment)': { price: 1.5, volume: 0.8, cagr: 1.3 }
  }

  const getProductCategoryMultiplier = (category: string) => {
    return productCategoryMultipliers[category] || { price: 1.0, volume: 1.0, cagr: 1.0 }
  }
  
  // Pipe Material Compatibility multipliers
  const bladeMaterialMultipliers: Record<string, { price: number; volume: number }> = {
    'Ductile Iron': { price: 1.2, volume: 1.3 },
    'Cast Iron': { price: 1.1, volume: 1.2 },
    'PVC': { price: 0.8, volume: 1.4 },
    'HDPE': { price: 0.9, volume: 1.3 },
    'Steel': { price: 1.3, volume: 1.1 },
    'Concrete / Asbestos Cement': { price: 1.0, volume: 1.0 }
  }
  
  // Application multipliers
  const applicationMultipliers: Record<string, { volume: number; price: number }> = {
    'Potable Water Distribution': { volume: 1.5, price: 1.2 },
    'Wastewater / Sewer Lines': { volume: 1.3, price: 1.1 },
    'Emergency Leak Repair': { volume: 1.4, price: 1.3 },
    'Planned Rehabilitation / Retrofits': { volume: 1.2, price: 1.2 },
    'New Installation & Expansion Projects': { volume: 1.1, price: 1.0 },
    'Industrial Water Lines': { volume: 1.0, price: 1.1 },
    'Agricultural / Irrigation Lines': { volume: 0.9, price: 0.9 },
    'Others': { volume: 0.8, price: 0.8 }
  }
  
  // Distribution channel multipliers
  const distributionChannelMultipliers: Record<string, { volume: number; price: number }> = {
    'Offline': { volume: 1.3, price: 1.1 },
    'Online': { volume: 1.2, price: 0.95 }
  }
  
  // Region-specific multipliers
  const regionMultipliers: Record<string, { volume: number; marketShare: number }> = {
    'Northeast': { volume: 1.3, marketShare: 1.2 },
    'Midwest': { volume: 1.4, marketShare: 1.3 },
    'South': { volume: 1.5, marketShare: 1.4 },
    'West': { volume: 1.2, marketShare: 1.1 }
  }
  
  // Brand-specific multipliers
  const brandPremiumMap: Record<string, number> = {}
  brands.forEach((brand, idx) => {
    brandPremiumMap[brand] = 0.8 + (idx % 3) * 0.4 // Creates 3 tiers: 0.8, 1.2, 1.6
  })

  const data: ShovelMarketData[] = []
  let recordId = 100000
  
  let seed = 42
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  
  for (const year of years) {
    for (const region of regions) {
      const regionMult = regionMultipliers[region]
      const countries = countryMap[region] || []
      // If no countries, use region name as country (e.g., "Rest of Europe")
      const countriesToProcess = countries.length > 0 ? countries : [region]
      
      for (const country of countriesToProcess) {
        for (const productTypeItem of productTypesList) {
          const { category: productCategory, subCategory: subProductCategory } = productTypeItem
          const productMult = getProductCategoryMultiplier(productCategory)
          
          for (const bladeMaterial of bladeMaterials) {
            const bladeMult = bladeMaterialMultipliers[bladeMaterial]
            
            for (const handleLength of handleLengths) {
              // Price Range multiplier
              const handleMult = handleLength === 'Luxury' ? 1.5 : handleLength === 'Premium' ? 1.2 : 0.8
              
              for (const application of applications) {
                const appMult = applicationMultipliers[application]
                
                // Select one random profession and sales channel instead of looping through all
                const profession = professions[Math.floor(seededRandom() * professions.length)]
                const salesChannel = salesChannels[Math.floor(seededRandom() * salesChannels.length)]
                
                // Determine distribution channel type based on sales channel
                const distributionChannelType = salesChannel.startsWith('D2C') || salesChannel.startsWith('Offline') || salesChannel.startsWith('Others') ? salesChannel : 'Online'
                const channelMult = distributionChannelMultipliers[salesChannel.includes('Offline') ? 'Offline' : 'Online']
                
                // Determine specific distribution channel
                const distributionChannel = salesChannel.includes('Offline')
                  ? offlineChannels[Math.floor(seededRandom() * offlineChannels.length)]
                  : onlineChannels[Math.floor(seededRandom() * onlineChannels.length)]
                
                const brand = brands[Math.floor(seededRandom() * brands.length)]
                const brandMult = brandPremiumMap[brand] || 1.0
                const company = companies[Math.floor(seededRandom() * companies.length)]
                
                // Apply all multipliers for variation
                const basePrice = 10 + seededRandom() * 90 // $10-$100
                const price = basePrice * productMult.price * bladeMult.price * brandMult * handleMult * (1 + (year - 2021) * 0.02)
                
                const baseVolume = 100 + seededRandom() * 900 // 100-1000 units
                const volumeUnits = Math.floor(
                  baseVolume * 
                  regionMult.volume * 
                  productMult.volume * 
                  bladeMult.volume * 
                  appMult.volume * 
                  channelMult.volume * 
                  (1 + (year - 2021) * 0.05)
                )
                
                const revenue = price * volumeUnits
                const marketValueUsd = revenue * (0.9 + seededRandom() * 0.2)
                
                const baseMarketShare = 1 + seededRandom() * 24
                const marketSharePct = baseMarketShare * regionMult.marketShare * brandMult
                
                const baseCAGR = -2 + seededRandom() * 12
                const cagr = baseCAGR * productMult.cagr
                const yoyGrowth = -5 + seededRandom() * 20
                const qty = Math.floor(volumeUnits * (0.8 + seededRandom() * 0.4))
                
                data.push({
                  recordId,
                  year,
                  region,
                  country,
                  productCategory,
                  subProductCategory,
                  productType: `${productCategory} - ${subProductCategory}`, // Kept for backward compatibility
                  bladeMaterial, // Product Form
                  handleLength, // Price Range
                  application, // Age Group
                  endUser: profession, // Profession
                  distributionChannelType: salesChannel, // Sales Channel
                  distributionChannel,
                  brand,
                  company,
                  price: Math.round(price * 100) / 100,
                  volumeUnits,
                  qty,
                  revenue: Math.round(revenue * 100) / 100,
                  marketValueUsd: Math.round(marketValueUsd * 100) / 100,
                  value: Math.round(marketValueUsd * 100) / 100,
                  marketSharePct: Math.round(marketSharePct * 100) / 100,
                  cagr: Math.round(cagr * 100) / 100,
                  yoyGrowth: Math.round(yoyGrowth * 100) / 100,
                })
                
                recordId++
              }
            }
          }
        }
      }
    }
  }
  
  return data
}

let dataCache: ShovelMarketData[] | null = null

export const getData = (): ShovelMarketData[] => {
  if (!dataCache) {
    try {
      dataCache = generateComprehensiveData()
    } catch (error) {
      dataCache = []
    }
  }
  return dataCache
}

// Function to clear cache and regenerate data (for development/testing)
export const clearDataCache = () => {
  dataCache = null
}

export interface FilterOptions {
  year?: number[]
  productCategory?: string[]
  subProductCategory?: string[]
  productType?: string[] // Kept for backward compatibility
  bladeMaterial?: string[]
  handleLength?: string[]
  application?: string[]
  endUser?: string[]
  distributionChannelType?: string[]
  distributionChannel?: string[]
  region?: string[]
  country?: string[]
  brand?: string[]
  company?: string[]
  [key: string]: any
}

export const filterDataframe = (data: ShovelMarketData[], filters: FilterOptions): ShovelMarketData[] => {
  let filtered = [...data]
  
  for (const [field, values] of Object.entries(filters)) {
    if (values && Array.isArray(values) && values.length > 0) {
      filtered = filtered.filter(item => {
        const itemValue = item[field as keyof ShovelMarketData]
        // Handle number to string conversion for year field
        if (field === 'year' && typeof itemValue === 'number') {
          return values.map(v => String(v)).includes(String(itemValue))
        }
        return values.includes(itemValue as any)
      })
    }
  }
  
  return filtered
}

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(1)
    return `${parseFloat(formatted).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}B`
  } else if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(1)
    return `${parseFloat(formatted).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
  } else if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(1)
    return `${parseFloat(formatted).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`
  }
  return Math.round(num).toLocaleString('en-US')
}

export const formatWithCommas = (num: number, decimals = 1): string => {
  const value = parseFloat(num.toFixed(decimals))
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export const addCommas = (num: number | null | undefined): string | number | null | undefined => {
  if (num === null || num === undefined || isNaN(num)) {
    return num
  }
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

// Product category and subcategory hierarchy for filters
export interface ProductCategoryHierarchy {
  mainCategory: string
  subCategories: string[]
}

export const getProductCategoryHierarchy = (): ProductCategoryHierarchy[] => {
  return [
    {
      mainCategory: "Pipe Repair & Connection Products",
      subCategories: [
        "Repair Clamps",
        "Repair Sleeves",
        "Wide-Range Couplings",
        "Transition Couplings",
        "Flange Adapters"
      ]
    },
    {
      mainCategory: "Restraint Couplings",
      subCategories: [
        "Service Line Products",
        "Service Saddles",
        "Tapping Sleeves"
      ]
    },
    {
      mainCategory: "Corporation Stops",
      subCategories: []
    },
    {
      mainCategory: "Curb Valves & Boxes",
      subCategories: []
    },
    {
      mainCategory: "Valve Solutions",
      subCategories: [
        "Gate Valves",
        "Butterfly Valves",
        "Insertion Valves",
        "Check Valves"
      ]
    },
    {
      mainCategory: "Hydrants & Flow Control",
      subCategories: [
        "Fire Hydrants",
        "Hydrant Repair Kits"
      ]
    },
    {
      mainCategory: "Others (Leak Detection & Condition Assessment)",
      subCategories: [
        "Acoustic Leak Detection Systems",
        "Smart Monitoring Sensors",
        "Pipe Condition Assessment Tools"
      ]
    }
  ]
}

// Kept for backward compatibility
export interface ProductTypeHierarchy {
  mainCategory: string
  subCategories: string[]
}

export const getProductTypeHierarchy = (): ProductTypeHierarchy[] => {
  return getProductCategoryHierarchy()
}

// Nested hierarchy interface for 3-level structure
export interface NestedSubCategory {
  name: string
  children?: string[]
}

export interface NestedHierarchyItem {
  mainCategory: string
  subCategories: (string | NestedSubCategory)[]
}

export const getSalesChannelHierarchy = (): NestedHierarchyItem[] => {
  return [
    {
      mainCategory: "Direct Sales",
      subCategories: []
    },
    {
      mainCategory: "Distributor / Wholesaler Network",
      subCategories: []
    },
    {
      mainCategory: "Online Procurement Platforms",
      subCategories: []
    },
    {
      mainCategory: "Federal & Infrastructure-Funded Projects",
      subCategories: []
    }
  ]
}

export type { ShovelMarketData }
