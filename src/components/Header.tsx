import { Bell, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  currentPage?: string
}

export function Header({ currentPage = 'Home' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 lg:px-8 py-5">
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary-light">
          <span className="hover:text-electric-blue cursor-pointer">Pages</span>
          <span>/</span>
          <span className="text-text-primary-light font-medium">{currentPage}</span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary-light hover:text-electric-blue transition-all"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary-light hover:text-electric-blue transition-all"
            aria-label="Settings"
          >
            <Settings size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            aria-label="User profile"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyan-accent rounded-full flex items-center justify-center"
            >
              <User className="text-white" size={16} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}

