import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface HierarchyItem {
  mainCategory: string
  subCategories: string[]
}

interface HierarchicalFilterDropdownProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hierarchy: HierarchyItem[]
}

export function HierarchicalFilterDropdown({
  label,
  value,
  onChange,
  hierarchy,
}: HierarchicalFilterDropdownProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleMainCategory = (mainCategory: string, subCategories: string[]) => {
    // Handle items with no subcategories
    if (subCategories.length === 0) {
      const isSelected = value.includes(mainCategory)
      if (isSelected) {
        onChange(value.filter(v => v !== mainCategory))
      } else {
        onChange([...value, mainCategory])
      }
      return
    }

    const allSubsSelected = subCategories.every(sub =>
      value.includes(`${mainCategory} - ${sub}`) || value.includes(mainCategory)
    )

    if (allSubsSelected) {
      // Deselect all subcategories
      const newValue = value.filter(v =>
        !v.startsWith(`${mainCategory} - `) && v !== mainCategory
      )
      onChange(newValue)
    } else {
      // Select all subcategories
      const newValue = [...value]
      subCategories.forEach(sub => {
        const fullName = `${mainCategory} - ${sub}`
        if (!newValue.includes(fullName)) {
          newValue.push(fullName)
        }
      })
      if (!newValue.includes(mainCategory)) {
        newValue.push(mainCategory)
      }
      onChange(newValue)
    }
  }

  const toggleSubCategory = (mainCategory: string, subCategory: string) => {
    const fullName = `${mainCategory} - ${subCategory}`
    const newValue = value.includes(fullName)
      ? value.filter(v => v !== fullName)
      : [...value, fullName]
    
    // Also toggle main category if needed
    if (!newValue.includes(fullName) && value.includes(mainCategory)) {
      onChange(newValue.filter(v => v !== mainCategory))
    } else if (newValue.includes(fullName) && !value.includes(mainCategory)) {
      onChange([...newValue, mainCategory])
    } else {
      onChange(newValue)
    }
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    const allValues: string[] = []
    hierarchy.forEach(item => {
      allValues.push(item.mainCategory)
      item.subCategories.forEach(sub => {
        allValues.push(`${item.mainCategory} - ${sub}`)
      })
    })
    onChange(allValues)
  }

  const selectedCount = value.length
  const displayText = selectedCount === 0 
    ? 'Select options' 
    : `${selectedCount} selected`

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 rounded-lg border flex items-center justify-between ${
          isDark 
            ? 'bg-navy-card border-navy-light text-text-primary-dark hover:border-electric-blue' 
            : 'bg-white border-gray-300 text-text-primary-light hover:border-electric-blue'
        } focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all`}
      >
        <span className={selectedCount === 0 ? 'text-gray-400' : ''}>
          {displayText}
        </span>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-2 rounded-lg shadow-xl border max-h-96 overflow-y-auto ${
            isDark 
              ? 'bg-navy-card border-navy-light' 
              : 'bg-white border-gray-300'
          }`}
        >
          {/* Action buttons */}
          <div className={`sticky top-0 z-10 flex gap-2 p-3 border-b ${
            isDark ? 'bg-navy-card border-navy-light' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={selectAll}
              className="flex-1 px-3 py-1.5 text-sm bg-electric-blue text-white rounded hover:bg-blue-600 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Hierarchical options */}
          <div className="p-2">
            {hierarchy.map((item) => {
              const hasSubCategories = item.subCategories.length > 0
              const isExpanded = expandedCategories.has(item.mainCategory)
              const isMainSelected = value.includes(item.mainCategory)
              const allSubsSelected = hasSubCategories && item.subCategories.every(sub =>
                value.includes(`${item.mainCategory} - ${sub}`)
              )
              const someSubsSelected = hasSubCategories && item.subCategories.some(sub =>
                value.includes(`${item.mainCategory} - ${sub}`)
              )

              return (
                <div key={item.mainCategory} className="mb-2">
                  {/* Main Category */}
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded cursor-pointer">
                    {hasSubCategories ? (
                      <button
                        onClick={() => toggleCategory(item.mainCategory)}
                        className="flex-shrink-0"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                        />
                      </button>
                    ) : (
                      <div className="w-4 flex-shrink-0" />
                    )}
                    <button
                      onClick={() => toggleMainCategory(item.mainCategory, item.subCategories)}
                      className="flex items-center gap-2 flex-1"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        (hasSubCategories ? allSubsSelected : isMainSelected)
                          ? 'bg-electric-blue border-electric-blue'
                          : someSubsSelected
                          ? 'bg-gray-400 border-gray-400'
                          : isDark
                          ? 'border-gray-500'
                          : 'border-gray-300'
                      }`}>
                        {((hasSubCategories ? (allSubsSelected || someSubsSelected) : isMainSelected)) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="font-bold text-left">{item.mainCategory}</span>
                    </button>
                  </div>

                  {/* Sub Categories */}
                  {hasSubCategories && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subCategories.map((sub) => {
                        const fullName = `${item.mainCategory} - ${sub}`
                        const isSelected = value.includes(fullName)

                        return (
                          <button
                            key={sub}
                            onClick={() => toggleSubCategory(item.mainCategory, sub)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded w-full text-left"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected
                                ? 'bg-electric-blue border-electric-blue'
                                : isDark
                                ? 'border-gray-500'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-sm">{sub}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
