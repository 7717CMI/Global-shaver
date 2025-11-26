import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, LucideIcon } from 'lucide-react'
import { DemoNotice } from '../components/DemoNotice'

interface HomeProps {
  onNavigate: (page: string) => void
}

interface AnalysisTile {
  title: string
  description: string
  icon: LucideIcon
  id: string
  gradient: string
}

export function Home({ onNavigate }: HomeProps) {
  const analysisTiles: AnalysisTile[] = [
    {
      title: "Market Analysis",
      description: "Explore market trends, pricing, growth rates, and competitive analysis",
      icon: TrendingUp,
      id: "MarketAnalysis",
      gradient: "#0075FF",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={itemVariants}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          U.S., GERMANY, CHINA, & JAPAN ELECTRONIC SHAVERS MARKET Dashboard
        </h1>
        <p className="text-lg text-electric-blue dark:text-cyan-accent">
          Industry Insights, Trends, Outlook, and Opportunity Analysis, 2025-2032
        </p>
      </motion.div>

      <DemoNotice />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 text-center">
            Select Analysis Category
          </h2>
          <p className="text-center text-text-secondary-light dark:text-text-secondary-dark mb-8">
            Choose your analysis approach to explore Global Electronic Shavers market data
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
          {analysisTiles.map((tile) => {
            const TileIcon = tile.icon
            
            return (
              <motion.button
                key={tile.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(tile.id)}
                className="w-full p-8 rounded-2xl border-2 border-gray-200 dark:border-navy-light bg-white dark:bg-navy-card hover:border-electric-blue hover:shadow-xl dark:hover:shadow-2xl transition-all text-left relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 transform group-hover:scale-110 transition-transform bg-electric-blue"
                    >
                      <TileIcon size={32} />
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ArrowRight
                        size={24}
                        className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-electric-blue transition-colors"
                      />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                    {tile.title}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {tile.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

