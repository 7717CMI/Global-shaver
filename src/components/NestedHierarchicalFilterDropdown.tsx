import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface NestedSubCategory {
  name: string
  children?: string[]
}

interface HierarchyItem {
  mainCategory: string
  subCategories: (string | NestedSubCategory)[]
}

interface NestedHierarchicalFilterDropdownProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hierarchy: HierarchyItem[]
}

export function NestedHierarchicalFilterDropdown({
  label,
  value,
  onChange,
  hierarchy,
}: NestedHierarchicalFilterDropdownProps) {
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

  const getAllSubItems = (item: HierarchyItem): string[] => {
    const items: string[] = []
    item.subCategories.forEach(sub => {
      if (typeof sub === 'string') {
        items.push(`${item.mainCategory} - ${sub}`)
      } else {
        items.push(`${item.mainCategory} - ${sub.name}`)
        if (sub.children) {
          sub.children.forEach(child => {
            items.push(`${item.mainCategory} - ${sub.name} - ${child}`)
          })
        }
      }
    })
    return items
  }

  const toggleMainCategory = (item: HierarchyItem) => {
    const allSubs = getAllSubItems(item)
    const allSelected = allSubs.every(sub => value.includes(sub))
    
    if (allSelected) {
      const newValue = value.filter(v => !allSubs.includes(v) && v !== item.mainCategory)
      onChange(newValue)
    } else {
      const newValue = [...value]
      allSubs.forEach(sub => {
        if (!newValue.includes(sub)) {
          newValue.push(sub)
        }
      })
      if (!newValue.includes(item.mainCategory)) {
        newValue.push(item.mainCategory)
      }
      onChange(newValue)
    }
  }

  const toggleSubCategory = (mainCategory: string, subName: string, hasChildren: boolean, children?: string[]) => {
    if (hasChildren && children) {
      // Toggle all children
      const allChildren = children.map(child => `${mainCategory} - ${subName} - ${child}`)
      const allSelected = allChildren.every(child => value.includes(child))
      
      if (allSelected) {
        const newValue = value.filter(v => !allChildren.includes(v) && v !== `${mainCategory} - ${subName}`)
        onChange(newValue)
      } else {
        const newValue = [...value]
        allChildren.forEach(child => {
          if (!newValue.includes(child)) {
            newValue.push(child)
          }
        })
        const fullName = `${mainCategory} - ${subName}`
        if (!newValue.includes(fullName)) {
          newValue.push(fullName)
        }
        onChange(newValue)
      }
    } else {
      const fullName = `${mainCategory} - ${subName}`
      const newValue = value.includes(fullName)
        ? value.filter(v => v !== fullName)
        : [...value, fullName]
      onChange(newValue)
    }
  }

  const toggleLeafItem = (mainCategory: string, subName: string, leafName: string) => {
    const fullName = `${mainCategory} - ${subName} - ${leafName}`
    const newValue = value.includes(fullName)
      ? value.filter(v => v !== fullName)
      : [...value, fullName]
    onChange(newValue)
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    const allValues: string[] = []
    hierarchy.forEach(item => {
      allValues.push(item.mainCategory)
      allValues.push(...getAllSubItems(item))
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
              const isExpanded = expandedCategories.has(item.mainCategory)
              const allSubs = getAllSubItems(item)
              const allSelected = allSubs.every(sub => value.includes(sub))
              const someSelected = allSubs.some(sub => value.includes(sub))

              return (
                <div key={item.mainCategory} className="mb-2">
                  {/* Main Category */}
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded cursor-pointer">
                    <button
                      onClick={() => toggleCategory(item.mainCategory)}
                      className="flex-shrink-0"
                    >
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                      />
                    </button>
                    <button
                      onClick={() => toggleMainCategory(item)}
                      className="flex items-center gap-2 flex-1"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        allSelected
                          ? 'bg-electric-blue border-electric-blue'
                          : someSelected
                          ? 'bg-gray-400 border-gray-400'
                          : isDark
                          ? 'border-gray-500'
                          : 'border-gray-300'
                      }`}>
                        {(allSelected || someSelected) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="font-bold text-left">{item.mainCategory}</span>
                    </button>
                  </div>

                  {/* Sub Categories */}
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subCategories.map((sub) => {
                        const isNested = typeof sub !== 'string'
                        const subName = typeof sub === 'string' ? sub : sub.name
                        const children = typeof sub !== 'string' ? sub.children : undefined
                        const hasChildren = isNested && children && children.length > 0
                        
                        const fullName = `${item.mainCategory} - ${subName}`
                        const isSubExpanded = expandedCategories.has(fullName)
                        
                        let isSelected = value.includes(fullName)
                        let someChildrenSelected = false
                        
                        if (hasChildren && children) {
                          const allChildren = children.map(c => `${item.mainCategory} - ${subName} - ${c}`)
                          isSelected = allChildren.every(c => value.includes(c))
                          someChildrenSelected = allChildren.some(c => value.includes(c))
                        }

                        return (
                          <div key={subName}>
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded">
                              {hasChildren && (
                                <button
                                  onClick={() => toggleCategory(fullName)}
                                  className="flex-shrink-0"
                                >
                                  <ChevronDown 
                                    size={14} 
                                    className={`transition-transform ${isSubExpanded ? 'rotate-0' : '-rotate-90'}`}
                                  />
                                </button>
                              )}
                              <button
                                onClick={() => toggleSubCategory(item.mainCategory, subName, hasChildren || false, children)}
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-electric-blue border-electric-blue'
                                    : someChildrenSelected
                                    ? 'bg-gray-400 border-gray-400'
                                    : isDark
                                    ? 'border-gray-500'
                                    : 'border-gray-300'
                                }`}>
                                  {(isSelected || someChildrenSelected) && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm">{subName}</span>
                              </button>
                            </div>

                            {/* Leaf items (3rd level) */}
                            {hasChildren && isSubExpanded && children && (
                              <div className="ml-8 mt-1 space-y-1">
                                {children.map((child) => {
                                  const leafFullName = `${item.mainCategory} - ${subName} - ${child}`
                                  const isLeafSelected = value.includes(leafFullName)

                                  return (
                                    <button
                                      key={child}
                                      onClick={() => toggleLeafItem(item.mainCategory, subName, child)}
                                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded w-full text-left"
                                    >
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                        isLeafSelected
                                          ? 'bg-electric-blue border-electric-blue'
                                          : isDark
                                          ? 'border-gray-500'
                                          : 'border-gray-300'
                                      }`}>
                                        {isLeafSelected && <Check size={12} className="text-white" />}
                                      </div>
                                      <span className="text-sm">{child}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
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
