import { motion } from 'framer-motion'

export function LoadingScreen() {
  const particleVariants = {
    animate: (i: number) => ({
      y: [0, -30, 0],
      x: [0, Math.sin(i) * 20, 0],
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2 + i * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.2
      }
    })
  }

  const orbitVariants = {
    animate: (radius: number) => ({
      rotate: [0, 360],
      transition: {
        duration: 8 + radius * 2,
        repeat: Infinity,
        ease: 'linear'
      }
    })
  }

  const floatingOrbVariants = {
    animate: (i: number) => ({
      y: [0, -50, 0],
      x: [0, Math.cos(i) * 30, 0],
      scale: [1, 1.3, 1],
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 3 + i,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.5
      }
    })
  }

  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const logoTextVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const circleVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const innerCircleVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: -180 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const dotVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 6 + 2
          const isBottomArea = Math.random() > 0.7
          return (
            <motion.div
              key={i}
              custom={i}
              variants={particleVariants}
              animate="animate"
              className="absolute rounded-full bg-electric-blue/20"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: isBottomArea ? `${70 + Math.random() * 30}%` : `${Math.random() * 100}%`,
                opacity: isBottomArea ? 0.3 : 0.2,
              }}
            />
          )
        })}
      </div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          custom={i}
          variants={floatingOrbVariants}
          animate="animate"
          className="absolute rounded-full bg-gradient-to-br from-electric-blue/20 to-cyan-accent/20 blur-xl"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${20 + i * 15}%`,
            top: `${30 + Math.sin(i) * 20}%`,
          }}
        />
      ))}

      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md px-4 relative z-10">
        <motion.div
          variants={logoTextVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-1 mb-8 relative"
        >
          <img 
            src="/logo.png" 
            alt="Coherent Market Insights" 
            className="h-16 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if image not found
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <motion.div className="flex-col hidden" style={{ display: 'none' }}>
            <motion.span
              animate={{
                textShadow: [
                  '0 0 0px rgba(26, 35, 126, 0)',
                  '0 0 20px rgba(0, 117, 255, 0.5)',
                  '0 0 0px rgba(26, 35, 126, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-3xl font-bold text-[#1a237e] leading-tight uppercase tracking-tight relative"
            >
              COHERENT
            </motion.span>
            <motion.span
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="text-xs font-sans text-[#1a237e] tracking-[0.2em] leading-tight uppercase"
            >
              MARKET INSIGHTS
            </motion.span>
          </motion.div>
        </motion.div>

        <div className="relative flex items-center justify-center my-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              custom={120 + i * 30}
              variants={orbitVariants}
              animate="animate"
              className="absolute"
              style={{
                width: `${140 + i * 40}px`,
                height: `${140 + i * 40}px`,
              }}
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-electric-blue/40 to-cyan-accent/40"
                style={{
                  width: `${8 + i * 2}px`,
                  height: `${8 + i * 2}px`,
                }}
              />
            </motion.div>
          ))}

          <motion.div
            variants={circleVariants}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-br from-electric-blue/30 to-cyan-accent/30 blur-2xl"
            style={{ width: '180px', height: '180px' }}
          />
          <motion.div
            variants={circleVariants}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-br from-electric-blue/20 to-cyan-accent/20 blur-xl"
            style={{ width: '140px', height: '140px' }}
          />
          <motion.div
            variants={circleVariants}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-br from-electric-blue/20 to-cyan-accent/20"
            style={{ width: '120px', height: '120px' }}
          />

          <motion.div
            variants={innerCircleVariants}
            initial="initial"
            animate="animate"
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-cyan-accent shadow-2xl ring-4 ring-electric-blue/20"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-2 mt-2"
        >
          <motion.h2
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-lg font-semibold text-text-primary-light"
          >
            Coherent Market Insights
          </motion.h2>
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3
            }}
            className="text-sm text-text-secondary-light"
          >
            Loading your data...
          </motion.p>
        </motion.div>

        <div className="flex items-center justify-center gap-2.5 mt-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              variants={dotVariants}
              animate="animate"
              transition={{ delay: index * 0.15 }}
              className="h-2.5 w-2.5 rounded-full bg-electric-blue relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-electric-blue"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: 'easeOut'
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-xs mt-4 relative">
          <div className="h-1 overflow-hidden rounded-full bg-gray-200 relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                ease: 'easeInOut'
              }}
              className="h-full bg-gradient-to-r from-electric-blue via-cyan-accent to-electric-blue relative"
            >
              <motion.div
                className="absolute inset-0 bg-electric-blue blur-md opacity-50"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 0.5
              }}
              style={{ width: '30%' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

