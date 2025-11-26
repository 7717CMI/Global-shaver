import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface GroupedOption {
  group: string
  items: (string | number)[]
}

interface FilterDropdownProps {
  label: string
  value: (string | number)[] | string | number
  onChange: (value: (string | number)[] | string | number) => void
  options: (string | number)[]
  multiple?: boolean
  groupedOptions?: GroupedOption[] // New prop for grouped display
  optionLabels?: Record<string | number, string> // Optional mapping of option values to display labels
}

export function FilterDropdown({ label, value, onChange, options, multiple = true, groupedOptions, optionLabels }: FilterDropdownProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Normalize value to string array for comparison
  const normalizeValue = (val: (string | number)[] | string | number): string[] => {
    if (multiple) {
      if (Array.isArray(val)) {
        return val.map(v => String(v))
      }
      return []
    }
    if (val !== undefined && val !== null && val !== '') {
      return [String(val)]
    }
    return []
  }

  const selectedValues = normalizeValue(value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value.map(v => String(v)) : []
      const optionStr = String(optionValue)
      const newValues = currentValues.includes(optionStr)
        ? currentValues.filter(v => v !== optionStr)
        : [...currentValues, optionStr]
      
      // Convert back to original type - check if options are numbers
      const areNumbers = options.length > 0 && typeof options[0] === 'number'
      const convertedValues = areNumbers 
        ? newValues.map(v => Number(v))
        : newValues
      
      onChange(convertedValues)
    } else {
      // For single select, preserve the original type
      const areNumbers = options.length > 0 && typeof options[0] === 'number'
      const convertedValue = areNumbers ? Number(optionValue) : optionValue
      onChange(convertedValue)
      setIsOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (multiple) {
      onChange([])
    } else {
      // Determine empty value based on option types
      const areNumbers = options.length > 0 && typeof options[0] === 'number'
      onChange(areNumbers ? 0 : '')
    }
    setIsOpen(false)
  }

  const getOptionLabel = (optionValue: string | number): string => {
    if (optionLabels && optionLabels[optionValue]) {
      return optionLabels[optionValue]
    }
    return String(optionValue)
  }

  const getDisplayText = () => {
    if (multiple) {
      if (selectedValues.length === 0) {
        return `Select ${label}...`
      }
      if (selectedValues.length === 1) {
        return getOptionLabel(selectedValues[0])
      }
      return `${selectedValues.length} selected`
    }
    return selectedValues[0] ? getOptionLabel(selectedValues[0]) : `Select ${label}...`
  }

  const getSelectedCount = () => {
    if (multiple) {
      return selectedValues.length
    }
    return selectedValues.length > 0 ? 1 : 0
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`${label} filter dropdown`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`w-full px-4 py-2 rounded-lg border text-left flex items-center justify-between ${
          isDark 
            ? 'bg-navy-card border-navy-light text-text-primary-dark hover:border-electric-blue' 
            : 'bg-white border-gray-300 text-text-primary-light hover:border-electric-blue'
        } focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all`}
      >
        <span className="truncate flex-1 mr-2">
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {getSelectedCount() > 0 && (
            <div
              role="button"
              tabIndex={0}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleClear(e)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleClear(e)
                }
              }}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-navy-light transition-colors cursor-pointer"
              aria-label="Clear selection"
            >
              <X size={14} className={isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'} />
            </div>
          )}
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${
              isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute z-[9999] w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto ${
            isDark
              ? 'bg-navy-card border-navy-light'
              : 'bg-white border-gray-200'
          }`}
          style={{ top: '100%' }}
        >
          <div className="p-1">
            {options.length === 0 && (!groupedOptions || groupedOptions.length === 0) ? (
              <div className={`px-3 py-2 text-sm ${
                isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'
              }`}>
                No options available
              </div>
            ) : groupedOptions && groupedOptions.length > 0 ? (
              // Render grouped options
              groupedOptions.map((group) => (
                <div key={group.group}>
                  {/* Group Header */}
                  <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 ${
                    isDark 
                      ? 'bg-navy-card text-text-secondary-dark border-b border-navy-light' 
                      : 'bg-gray-50 text-text-secondary-light border-b border-gray-200'
                  }`}>
                    {group.group}
                  </div>
                  {/* Group Items */}
                  {group.items.map((option) => {
                    const optionValue = String(option)
                    const isSelected = selectedValues.includes(optionValue)
                    return (
                      <button
                        key={optionValue}
                        type="button"
                        onClick={() => handleSelect(optionValue)}
                        className={`w-full px-6 py-2 text-left rounded flex items-center gap-2 hover:bg-opacity-50 transition-colors ${
                          isDark
                            ? isSelected
                              ? 'bg-electric-blue bg-opacity-20 text-text-primary-dark'
                              : 'hover:bg-navy-light text-text-primary-dark'
                            : isSelected
                              ? 'bg-electric-blue bg-opacity-10 text-text-primary-light'
                              : 'hover:bg-gray-100 text-text-primary-light'
                        }`}
                      >
                        {multiple && (
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-electric-blue border-electric-blue'
                              : isDark
                                ? 'border-navy-light'
                                : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                        )}
                        <span className="flex-1 truncate">{getOptionLabel(option)}</span>
                        {!multiple && isSelected && (
                          <Check size={16} className="text-electric-blue flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            ) : (
              // Render flat options (original behavior)
              options.map((option) => {
                const optionValue = String(option)
                const isSelected = selectedValues.includes(optionValue)
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => handleSelect(optionValue)}
                    className={`w-full px-3 py-2 text-left rounded flex items-center gap-2 hover:bg-opacity-50 transition-colors ${
                      isDark
                        ? isSelected
                          ? 'bg-electric-blue bg-opacity-20 text-text-primary-dark'
                          : 'hover:bg-navy-light text-text-primary-dark'
                        : isSelected
                          ? 'bg-electric-blue bg-opacity-10 text-text-primary-light'
                          : 'hover:bg-gray-100 text-text-primary-light'
                    }`}
                  >
                    {multiple && (
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-electric-blue border-electric-blue'
                          : isDark
                            ? 'border-navy-light'
                            : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    )}
                    <span className="flex-1 truncate">{getOptionLabel(option)}</span>
                    {!multiple && isSelected && (
                      <Check size={16} className="text-electric-blue flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
