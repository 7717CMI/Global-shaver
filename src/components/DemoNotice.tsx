import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function DemoNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 p-5 bg-gradient-to-r from-yellow-50 via-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:via-yellow-900/25 dark:to-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl shadow-lg flex items-start gap-4 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
      </div>
      
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 relative z-10" size={24} />
      </motion.div>
      <div className="flex-1 relative z-10">
        <h3 className="font-bold text-lg text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Demo Data Notice
        </h3>
        <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200 font-medium">
          This dashboard uses synthetic/demo data for illustration purposes only. No real-world Electronic Shavers Market Data is associated with this application.
        </p>
      </div>
    </motion.div>
  )
}

