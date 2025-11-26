import { Menu } from 'lucide-react'
import { motion } from 'framer-motion'

interface MobileMenuProps {
  onClick: () => void
}

export function MobileMenu({ onClick }: MobileMenuProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label="Open navigation menu"
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-navy-card rounded-lg shadow-lg text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-navy-light transition-colors"
    >
      <Menu size={24} />
    </motion.button>
  )
}

