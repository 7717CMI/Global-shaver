export interface CustomerIntelligenceData {
  region: string
  sNo: string
  companyName: string
  industrySector: string
  headquartersAddress: string
  yearsOfExistence: string
  name: string
  decisionRole: string
  emailId: string
  website: string
  telephone: string
  typeOfShovelRequired: string
  primaryUseCase: string
  estimatedVolumeRequirement: string
  replacementCycle: string
  existingBrandsUsed: string
  qualityPreference: string
  priceSensitivity: string
  certificationsRequired: string
  sustainabilityPreference: string
  demandAttractiveScore: string
  fitForOEMShovelType: string
  leadPotential: string
}

export async function loadCSVData(): Promise<CustomerIntelligenceData[]> {
  try {
    const response = await fetch('/combine_global.csv')
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split(/\r?\n/).filter(line => line.trim())
    
    if (lines.length < 2) {
      return []
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0])
    
    // Parse data rows
    const data: CustomerIntelligenceData[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length > 0) {
        const row: any = {}
        // Map headers to data fields
        const headerMap: Record<string, keyof CustomerIntelligenceData> = {
          'Region': 'region',
          'S.No.': 'sNo',
          'Company Name': 'companyName',
          'Industry / Sector': 'industrySector',
          "Headquarter's Address": 'headquartersAddress',
          'Years of Existence': 'yearsOfExistence',
          'Name': 'name',
          'Decision Role': 'decisionRole',
          'Email ID': 'emailId',
          'Website': 'website',
          'Telephone': 'telephone',
          'Type of Shovel Required': 'typeOfShovelRequired',
          'Primary Use Case': 'primaryUseCase',
          'Estimated Volume Requirement (Annual)': 'estimatedVolumeRequirement',
          'Replacement Cycle': 'replacementCycle',
          'Existing Brands Used': 'existingBrandsUsed',
          'Quality Preference': 'qualityPreference',
          'Price Sensitivity': 'priceSensitivity',
          'Certifications Required': 'certificationsRequired',
          'Sustainability Preference': 'sustainabilityPreference',
          'Demand Attractive Score': 'demandAttractiveScore',
          'Fit for OEM / Shovel Type': 'fitForOEMShovelType',
          'Lead Potential': 'leadPotential',
        }
        
        const rowData: any = {}
        headers.forEach((header, index) => {
          const mappedKey = headerMap[header.trim()]
          if (mappedKey) {
            rowData[mappedKey] = values[index] || ''
          }
        })
        
        data.push({
          region: rowData.region || '',
          sNo: rowData.sNo || '',
          companyName: rowData.companyName || '',
          industrySector: rowData.industrySector || '',
          headquartersAddress: rowData.headquartersAddress || '',
          yearsOfExistence: rowData.yearsOfExistence || '',
          name: rowData.name || '',
          decisionRole: rowData.decisionRole || '',
          emailId: rowData.emailId || '',
          website: rowData.website || '',
          telephone: rowData.telephone || '',
          typeOfShovelRequired: rowData.typeOfShovelRequired || '',
          primaryUseCase: rowData.primaryUseCase || '',
          estimatedVolumeRequirement: rowData.estimatedVolumeRequirement || '',
          replacementCycle: rowData.replacementCycle || '',
          existingBrandsUsed: rowData.existingBrandsUsed || '',
          qualityPreference: rowData.qualityPreference || '',
          priceSensitivity: rowData.priceSensitivity || '',
          certificationsRequired: rowData.certificationsRequired || '',
          sustainabilityPreference: rowData.sustainabilityPreference || '',
          demandAttractiveScore: rowData.demandAttractiveScore || '',
          fitForOEMShovelType: rowData.fitForOEMShovelType || '',
          leadPotential: rowData.leadPotential || '',
        })
      }
    }
    
    return data
  } catch (error) {
    console.error('Error loading CSV data:', error)
    return []
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Add last field
  result.push(current.trim())
  
  return result
}

