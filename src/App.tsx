import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MobileMenu } from './components/MobileMenu'
import { LoadingScreen } from './components/LoadingScreen'
import { Home } from './pages/Home'
import { MarketAnalysis } from './pages/MarketAnalysis'
import { Contact } from './pages/Contact'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState('Home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <Home onNavigate={setActivePage} />
      case 'MarketAnalysis':
        return <MarketAnalysis onNavigate={setActivePage} />
      case 'Contact':
        return <Contact onNavigate={setActivePage} />
      default:
        return <Home onNavigate={setActivePage} />
    }
  }

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'Home': 'Home',
      'MarketAnalysis': 'Market Analysis',
      'Contact': 'Contact Us'
    }
    return titles[activePage] || 'Home'
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <ThemeProvider>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      <div className="min-h-screen bg-gray-50 dark:bg-navy-dark transition-colors duration-300">
        <MobileMenu onClick={() => setSidebarOpen(true)} />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activePage}
          onNavigate={setActivePage}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
          <Header currentPage={getPageTitle()} />
          <main className="p-6 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App


