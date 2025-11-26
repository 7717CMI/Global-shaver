import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface ContactProps {
  onNavigate: (page: string) => void
}

export function Contact({ onNavigate }: ContactProps) {
  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('Home')}
        className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Home
      </motion.button>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Contact Us
        </h1>
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-6 bg-white dark:bg-navy-card rounded-lg border border-gray-200 dark:border-navy-light">
            <MapPin className="text-electric-blue mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">Address</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Office No. 401-402, Bremen Business Centre<br />
                University Road, Aundh<br />
                Pune – 411007, Maharashtra, India
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white dark:bg-navy-card rounded-lg border border-gray-200 dark:border-navy-light">
            <Phone className="text-electric-blue mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">Phone (India office)</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">+91-848-285-0837</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white dark:bg-navy-card rounded-lg border border-gray-200 dark:border-navy-light">
            <Mail className="text-electric-blue mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">Email (Sales)</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">sales@coherentmarketinsights.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

