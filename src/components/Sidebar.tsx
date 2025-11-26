import { Home, TrendingUp, Mail, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'

interface SidebarProps {
  activeItem?: string
  isOpen?: boolean
  onClose?: () => void
  onNavigate?: (page: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ activeItem = 'Home', isOpen = true, onClose, onNavigate, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const navItems = [
    { icon: Home, label: 'Home', id: 'Home' },
    { icon: TrendingUp, label: 'Market Analysis', id: 'MarketAnalysis' },
    { icon: Mail, label: 'Contact Us', id: 'Contact' },
  ]

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    desktop: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const getSidebarState = () => {
    if (isDesktop) {
      return 'desktop'
    }
    return isOpen ? 'open' : 'closed'
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={getSidebarState()}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50 ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 relative">
          <div className="flex items-center justify-between">
            {!isCollapsed && <Logo isCollapsed={isCollapsed} />}
            {isCollapsed && <div className="w-full" />}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary-light transition-all"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary-light"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <motion.button
                  key={item.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onNavigate?.(item.id)
                    if (window.innerWidth < 1024) {
                      onClose?.()
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group min-h-[44px] ${
                    isActive
                      ? 'bg-electric-blue text-white'
                      : 'text-text-secondary-light hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium leading-tight whitespace-normal break-words text-left">
                      {item.label.split(' ').map((word, idx, arr) => (
                        <span key={idx}>
                          {word}
                          {idx < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  )}
                  {isCollapsed && isActive && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                    ></motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </nav>
      </motion.div>
    </>
  )
}

