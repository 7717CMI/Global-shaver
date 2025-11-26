# Global Shovel Market Analytics Dashboard

A modern React-based dashboard for global shovel market analytics. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Market Analysis:**
  - Market value and volume analysis by segments
  - Product Type, Blade Material, Handle Length analysis
  - Application and End User segmentation
  - Distribution channel analysis
  - Regional and country-wise breakdowns
  - Interactive charts (Bar charts, Pie charts, Stacked bar charts)

- **Customer Intelligence:**
  - Customer data analysis and insights
  - Comprehensive customer intelligence metrics

- **Modern UI:**
  - Dark/Light theme support
  - Responsive design
  - Collapsible sidebar navigation
  - Interactive charts with Recharts
  - Smooth animations with Framer Motion

- **Features:**
  - Multi-filter data analysis
  - KPI cards with key metrics
  - Interactive charts (Bar, Pie, Stacked Bar)
  - Client-side data generation (no server required)
  - Fast and lightweight
  - Vercel-ready deployment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/7717CMI/d05.git
cd d05
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

To build the application for production:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Deployment to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository (https://github.com/7717CMI/d05)
4. Vercel will automatically detect the Vite app and deploy it

The `vercel.json` configuration file is already included for optimal deployment.

### Option 2: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Project Structure

```
d05/
├── public/
│   ├── combine_global.csv
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── BarChart.tsx
│   │   ├── FilterDropdown.tsx
│   │   ├── Header.tsx
│   │   ├── PieChart.tsx
│   │   ├── RegionCountryStackedBarChart.tsx
│   │   ├── SegmentGroupedBarChart.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── MarketAnalysis.tsx
│   │   ├── CustomerIntelligence.tsx
│   │   └── Contact.tsx
│   ├── utils/
│   │   ├── dataGenerator.ts
│   │   ├── chartColors.ts
│   │   └── ...
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vercel.json
├── vite.config.ts
└── README.md
```

## Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Chart library
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Data Generation

The dashboard uses client-side data generation to create comprehensive shovel market data. This eliminates the need for a backend server and makes the application fully static and deployable anywhere.

The data includes:
- Multiple regions and countries
- Various product types (Digging Shovel, Snow Shovel, Trenching Shovel, etc.)
- Blade materials (Carbon Steel, Stainless Steel, Aluminum, etc.)
- Handle lengths and applications
- Distribution channels (Offline and Online)
- Time-series data from 2021-2035

## Notes

- This dashboard uses demo/synthetic data for illustration purposes only
- No real-world data is associated with this application
- For production use, replace the data generator with actual API endpoints

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
