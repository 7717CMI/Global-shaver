# Healthcare Dashboard - Graph Documentation

## Overview
This document provides detailed information about each graph/chart in the healthcare dashboard, including their purpose, data sources, and how to interpret them.

---

## 1. EPIDEMIOLOGY ANALYSIS PAGE

### 1.1 Disease Prevalence Bar Chart
**Type:** Vertical Bar Chart  
**Location:** Top left of main grid  
**X-Axis:** Disease names (HBV, Influenza, Pneumococcal, TCV, MMR, HPV, Herpes, Rotavirus, Meningococcal, Varicella)  
**Y-Axis:** Prevalence (Number of Cases)  
**Data Format:** Billions (B), Millions (M), Thousands (K)

**Purpose:**
- Shows the total number of disease cases (prevalence) for each vaccine-preventable disease
- Helps identify which diseases have the highest burden
- Data aggregated across all selected regions and years

**How to Read:**
- Taller bars = Higher disease prevalence
- Hover over bars to see exact case numbers
- Use filters to focus on specific years, regions, or diseases
- Sorted from highest to lowest prevalence

**Business Insight:**
- Identifies high-burden diseases requiring priority intervention
- Helps pharmaceutical companies focus R&D efforts
- Supports public health resource allocation decisions

---

### 1.2 Incidence by Region Pie Chart
**Type:** Pie Chart  
**Location:** Top right of main grid  
**Data:** Incidence cases by geographic region  
**Title:** "Incidence by Region (% Distribution)"

**Purpose:**
- Shows how new disease cases (incidence) are distributed across geographic regions
- Visualizes regional disease burden as percentages
- Helps identify geographic hotspots

**Regions Included:**
1. **North America** - USA, Canada, Mexico
2. **Europe** - Germany, UK, France, Spain, Italy, Poland, Romania
3. **APAC** (Asia-Pacific) - Japan, Australia, Singapore, China, India, Thailand, Pakistan, Bangladesh, Nepal
4. **Latin America** - Brazil, Argentina, Chile, Colombia, Peru
5. **Middle East** - UAE, Saudi Arabia, Israel, Egypt, Iraq
6. **Africa** - South Africa, Nigeria, Kenya, Ethiopia, Ghana

**How to Read:**
- Each slice represents a region's share of total incidence
- Labels show region names outside the pie
- Hover to see exact values and percentages
- Larger slices = Higher disease incidence in that region

**Business Insight:**
- Guides market entry strategy for pharmaceutical companies
- Identifies regions with highest disease burden
- Supports targeted vaccination campaigns
- Helps optimize distribution networks

---

### 1.3 Prevalence vs Incidence Trend Line Chart
**Type:** Multi-Line Chart  
**Location:** Bottom of main grid (full width)  
**X-Axis:** Year (2021-2035)  
**Y-Axis:** Number of Cases  
**Lines:** Blue = Prevalence, Green/Teal = Incidence

**Purpose:**
- Shows temporal trends of disease prevalence and incidence over 15 years
- Compares how existing cases (prevalence) vs new cases (incidence) change over time
- Helps forecast future disease burden

**Key Differences:**
- **Prevalence** (Blue Line): Total existing cases at a given time
- **Incidence** (Green Line): New cases occurring in a specific time period

**How to Read:**
- Upward trends = Disease burden increasing
- Downward trends = Effective disease control
- Gap between lines shows case accumulation
- Hover on data points for exact yearly values

**Business Insight:**
- Forecasts future vaccine demand
- Identifies growing or declining markets
- Supports long-term strategic planning
- Validates effectiveness of vaccination programs

---

### 1.4 Interactive KPI Cards (Clickable for Pie Charts)

#### Total Prevalence Card
**Click to View:** Disease breakdown by prevalence  
**Shows:** Pie chart with all 10 diseases and their % contribution to total prevalence

#### Total Incidence Card
**Click to View:** Disease breakdown by incidence  
**Shows:** Pie chart with all 10 diseases and their % contribution to total incidence

**Purpose:**
- Provides drill-down capability from summary to detail
- Shows which diseases contribute most to overall burden
- Interactive exploration of data composition

---

## 2. VACCINATION RATE ANALYSIS PAGE

### 2.1 Vaccination Rate by Disease Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Disease names  
**Y-Axis:** Vaccination Rate (%)

**Purpose:**
- Shows vaccination coverage percentage for each disease
- Identifies under-vaccinated diseases
- Tracks progress toward vaccination goals

**How to Read:**
- Higher bars = Better vaccination coverage
- Bars below 75% may indicate gaps in coverage
- Compare across diseases to find priorities

**Business Insight:**
- Identifies market gaps for vaccine promotion
- Shows where educational campaigns are needed
- Helps set sales targets by disease category

---

### 2.2 Vaccination Coverage by Region Pie Chart
**Type:** Pie Chart  
**Data:** Regional vaccination coverage distribution

**Purpose:**
- Shows which regions have highest/lowest vaccination rates
- Identifies geographic disparities in vaccine access
- Guides targeted intervention strategies

**Business Insight:**
- Identifies underserved markets with growth potential
- Supports equity-focused distribution strategies
- Helps allocate field force resources

---

### 2.3 Vaccination Rate Trend Over Time Line Chart
**Type:** Line Chart  
**X-Axis:** Year  
**Y-Axis:** Average Vaccination Rate (%)

**Purpose:**
- Tracks vaccination rate changes over 15-year period
- Shows program effectiveness over time
- Identifies acceleration or deceleration in coverage

**Business Insight:**
- Validates impact of vaccination campaigns
- Forecasts future coverage levels
- Supports investment decisions in manufacturing capacity

---

## 3. PRICING ANALYSIS PAGE

### 3.1 Average Price by Brand Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Brand names (vaccine products)  
**Y-Axis:** Average Price (USD)

**Purpose:**
- Compares pricing across different vaccine brands
- Shows premium vs budget product positioning
- Identifies price leaders and followers

**How to Read:**
- Each bar = Average price for that brand across all markets
- Higher bars = Premium-priced products
- Lower bars = Budget/generic alternatives

**Business Insight:**
- Supports competitive pricing strategy
- Identifies pricing gaps in portfolio
- Guides product positioning decisions
- Shows price elasticity opportunities

---

### 3.2 Price Distribution by Disease Pie Chart
**Type:** Pie Chart  
**Data:** Market value distribution by disease category

**Purpose:**
- Shows which diseases generate highest revenue
- Visualizes market size by therapeutic area
- Identifies high-value vs low-value segments

**Business Insight:**
- Prioritizes R&D investment by market size
- Guides portfolio management decisions
- Supports business case development

---

### 3.3 Price Trend Over Time Line Chart
**Type:** Multi-Line Chart  
**X-Axis:** Year  
**Y-Axis:** Average Price (USD)  
**Multiple Lines:** Different price segments or brands

**Purpose:**
- Tracks price evolution over 15 years
- Shows inflation-adjusted pricing trends
- Identifies pricing pressure or opportunities

**Business Insight:**
- Forecasts future pricing scenarios
- Identifies optimal pricing windows
- Supports contract negotiation strategy

---

## 4. CAGR (Compound Annual Growth Rate) ANALYSIS PAGE

### 4.1 CAGR by Brand Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Brand names  
**Y-Axis:** CAGR (%)

**Purpose:**
- Shows growth rate of each vaccine brand
- Identifies fastest-growing products
- Compares brand performance

**How to Read:**
- Positive values = Growing brands
- Negative values = Declining brands
- Higher bars = Faster growth

**Business Insight:**
- Identifies stars and dogs in portfolio
- Guides investment allocation
- Supports brand divestment decisions
- Identifies acquisition targets

---

### 4.2 Market Growth by Region Pie Chart
**Type:** Pie Chart  
**Data:** Growth contribution by region

**Purpose:**
- Shows which regions drive overall market growth
- Identifies emerging vs mature markets
- Visualizes geographic growth patterns

**Business Insight:**
- Prioritizes market entry sequence
- Allocates marketing budgets geographically
- Supports capacity expansion decisions

---

### 4.3 CAGR Trend by Year Line Chart
**Type:** Line Chart  
**X-Axis:** Year  
**Y-Axis:** CAGR (%)

**Purpose:**
- Shows how growth rate changes over time
- Identifies acceleration or deceleration phases
- Forecasts future growth trajectories

**Business Insight:**
- Validates market maturity stage
- Times market entry/exit decisions
- Supports valuation models

---

## 5. MSA (MARKET SHARE ANALYSIS) COMPARISON PAGE

### 5.1 Top Markets by Value Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Disease/Market names  
**Y-Axis:** Market Value (USD in Billions)

**Purpose:**
- Ranks markets by total value (revenue)
- Identifies largest revenue-generating diseases
- Shows market attractiveness by size

**How to Read:**
- Sorted from highest to lowest value
- Top 10 markets displayed
- Hover for exact revenue figures

**Business Insight:**
- Prioritizes sales and marketing investments
- Identifies must-win markets
- Supports portfolio strategy
- Guides M&A decisions

---

### 5.2 Total Market Value by Brand Pie Chart
**Type:** Pie Chart  
**Data:** Revenue distribution across brands

**Purpose:**
- Shows brand market share as % of total revenue
- Identifies market leaders and challengers
- Visualizes competitive landscape

**How to Read:**
- Each slice = One brand's revenue share
- Larger slices = Market leaders
- Hover to see exact revenue and %

**Business Insight:**
- Identifies consolidation opportunities
- Shows competitive intensity
- Guides brand positioning strategy
- Supports competitive response planning

---

### 5.3 Market Share Trend Line Chart
**Type:** Multi-Line Chart  
**X-Axis:** Year  
**Y-Axis:** Market Share (%)  
**Multiple Lines:** Different brands

**Purpose:**
- Tracks how market share shifts over time
- Shows winners and losers in competitive battle
- Identifies market share inflection points

**Business Insight:**
- Validates competitive strategy effectiveness
- Forecasts future market position
- Triggers strategic adjustments
- Supports investor communications

---

## 6. PROCUREMENT ANALYSIS PAGE

### 6.1 Procurement Volume by Type Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Procurement channels (UNICEF, GAVI, PAHO, Hospital, Private Clinic, Government)  
**Y-Axis:** Volume (Units)

**Purpose:**
- Shows vaccine distribution across procurement channels
- Identifies largest customers by volume
- Compares public vs private sector demand

**Key Channels:**
- **UNICEF** - UN children's fund (global public procurement)
- **GAVI** - Vaccine alliance (low-income country support)
- **PAHO** - Pan American Health Organization (regional procurement)
- **Government** - National government direct purchase
- **Hospital** - Hospital networks and systems
- **Private Clinic** - Private healthcare providers

**Business Insight:**
- Optimizes channel strategy
- Supports pricing differentiation by channel
- Guides key account management
- Identifies tender opportunities

---

### 6.2 Procurement Distribution Pie Chart
**Type:** Pie Chart  
**Data:** % distribution across channels

**Purpose:**
- Visualizes channel mix
- Shows dependence on specific channels
- Identifies channel concentration risk

**Business Insight:**
- Diversifies channel risk
- Guides channel development priorities
- Supports contract negotiation strategy

---

### 6.3 Procurement Trend Line Chart
**Type:** Multi-Line Chart  
**X-Axis:** Year  
**Y-Axis:** Procurement Volume  
**Multiple Lines:** Different channels

**Purpose:**
- Tracks how channels grow or shrink over time
- Identifies emerging procurement models
- Forecasts future channel mix

**Business Insight:**
- Adapts channel strategy to trends
- Allocates resources to growing channels
- Manages declining channel relationships

---

## 7. BRAND-DEMOGRAPHIC ANALYSIS PAGE

### 7.1 Brand Performance by Age Group Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** Age groups (Pediatric, Adult, Elderly, All Ages)  
**Y-Axis:** Market Value or Volume

**Purpose:**
- Shows which age groups drive brand performance
- Identifies target demographic segments
- Compares demographic reach across brands

**Age Groups:**
- **Pediatric** - Children/infants (0-17 years)
- **Adult** - Working age population (18-64 years)
- **Elderly** - Senior citizens (65+ years)
- **All Ages** - Universal vaccines (e.g., Influenza)

**Business Insight:**
- Targets marketing messages by age
- Develops age-specific products
- Supports indication expansion strategies
- Guides clinical trial design

---

### 7.2 Gender Distribution Pie Chart
**Type:** Pie Chart  
**Data:** Male vs Female vaccination patterns

**Purpose:**
- Shows gender-specific vaccination rates
- Identifies gender gaps in coverage
- Supports gender-focused interventions

**Business Insight:**
- Develops gender-targeted campaigns
- Addresses health equity issues
- Optimizes promotional messaging

---

### 7.3 Demographic Trend Line Chart
**Type:** Multi-Line Chart  
**X-Axis:** Year  
**Y-Axis:** Volume/Value by demographic  
**Multiple Lines:** Different age groups or genders

**Purpose:**
- Tracks how demographics change over time
- Shows aging population impact
- Identifies shifting demand patterns

**Business Insight:**
- Forecasts demographic-driven demand
- Adapts portfolio to population changes
- Supports long-term capacity planning

---

## 8. FDF (FINISHED DOSAGE FORM) ANALYSIS PAGE

### 8.1 Volume by Formulation Type Bar Chart
**Type:** Vertical Bar Chart  
**X-Axis:** FDF types (Vial, Prefilled Syringe, Multi-dose Vial, Oral Solution)  
**Y-Axis:** Volume (Units)

**Purpose:**
- Shows preference for different dosage forms
- Identifies most popular delivery methods
- Compares formulation adoption rates

**FDF Types:**
- **Vial** - Traditional glass vials (requires syringe preparation)
- **Prefilled Syringe** - Ready-to-use single-dose syringe
- **Multi-dose Vial** - Vial containing multiple doses
- **Oral Solution** - Liquid oral vaccine (e.g., Rotavirus)

**Business Insight:**
- Guides formulation development priorities
- Supports manufacturing investment decisions
- Identifies premium formulation opportunities
- Optimizes SKU portfolio

---

### 8.2 FDF Market Share Pie Chart
**Type:** Pie Chart  
**Data:** % distribution by formulation type

**Purpose:**
- Visualizes formulation mix in market
- Shows dominant vs niche formulations
- Identifies formulation trends

**Business Insight:**
- Prioritizes line extensions
- Identifies format switching opportunities
- Guides packaging strategy

---

### 8.3 Route of Administration (ROA) Distribution
**Type:** Bar or Pie Chart  
**Data:** IM (Intramuscular), SC (Subcutaneous), Oral, Intranasal

**Purpose:**
- Shows delivery route preferences
- Identifies patient-friendly options
- Compares invasive vs non-invasive routes

**ROA Types:**
- **IM** - Intramuscular injection (most common)
- **SC** - Subcutaneous injection (under skin)
- **Oral** - Taken by mouth
- **Intranasal** - Nasal spray

**Business Insight:**
- Guides product differentiation strategy
- Supports patient adherence programs
- Identifies novel delivery opportunities

---

## GENERAL CHART FEATURES

### Interactive Elements
1. **Hover Tooltips:** All charts show detailed values when you hover over elements
2. **Clickable KPIs:** Click on summary cards to open detailed pie chart breakdowns
3. **Filters:** Use dropdowns to customize data by Year, Region, Disease, Brand, etc.
4. **Value Formatting:** Large numbers automatically formatted (B = Billion, M = Million, K = Thousand)

### Color Coding
- **Blue/Purple:** Primary data series, prevalence, market value
- **Green/Teal:** Secondary data series, incidence, growth rates
- **Red/Orange:** Alerts, demo notices, critical metrics
- **Multi-color:** Pie charts for easy segment differentiation

### Time Periods
- **Historical:** 2021-2025 (5 years actual data)
- **Forecast:** 2026-2035 (10 years projected data)
- **Total Range:** 15 years of comprehensive data

---

## DATA SOURCES & METHODOLOGY

### Data Generation
- Synthetic data generated using seeded random algorithms
- Realistic distributions based on healthcare industry patterns
- Consistent relationships between variables (e.g., vaccination rate vs disease incidence)

### Key Metrics Explained

**Prevalence:**
- Total number of existing disease cases in a population
- Includes both old and new cases
- Measures overall disease burden

**Incidence:**
- Number of new disease cases in a specific time period
- Excludes existing cases
- Measures disease spread rate

**Vaccination Rate:**
- Percentage of target population that received vaccine
- Calculated as (vaccinated / target population) × 100
- Goal: Usually 75-95% for herd immunity

**CAGR (Compound Annual Growth Rate):**
- Average annual growth rate over multiple years
- Formula: ((Ending Value / Beginning Value)^(1/Years) - 1) × 100
- Shows sustained growth vs short-term spikes

**Market Share:**
- Brand's revenue as % of total market revenue
- Formula: (Brand Revenue / Total Market Revenue) × 100
- Indicates competitive position

---

## BEST PRACTICES FOR USING THE DASHBOARD

### For Executives
1. Start with **Home Page** for high-level overview
2. Click into **MSA Comparison** for market size and share
3. Review **CAGR Analysis** for growth opportunities
4. Check **Pricing Analysis** for revenue optimization

### For Market Access Teams
1. Focus on **Procurement Analysis** for channel strategy
2. Use **Vaccination Rate** to identify coverage gaps
3. Review **Regional** filters for market entry priorities
4. Track **Pricing** trends for tender negotiations

### For Medical Affairs
1. **Epidemiology** page for disease burden data
2. **Vaccination Rate** for coverage improvement areas
3. **Brand-Demographic** for patient targeting
4. **FDF Analysis** for formulation preferences

### For Commercial Teams
1. **MSA Comparison** for competitive landscape
2. **Brand-Demographic** for targeting strategy
3. **CAGR** for portfolio prioritization
4. **Pricing** for competitive positioning

---

## TIPS & SHORTCUTS

**Filtering:**
- Apply multiple filters for granular analysis
- Clear individual filters to compare subsets
- Use "All" option to see complete picture

**Exporting Insights:**
- Take screenshots of specific charts for presentations
- Document filter settings used for analysis
- Compare before/after filter states for insights

**Performance:**
- Filter data before viewing detailed charts for faster loading
- Close modal dialogs when done to improve responsiveness
- Refresh page if charts don't update properly

**Troubleshooting:**
- If percentages show 0%, hover over chart for actual calculated values
- If chart looks empty, check if filters are too restrictive
- If numbers seem high, remember B = Billion, M = Million

---

## GLOSSARY

**Epidemiology:** Study of disease patterns in populations  
**Prevalence:** Total existing disease cases  
**Incidence:** New disease cases in a time period  
**CAGR:** Compound Annual Growth Rate  
**MSA:** Market Share Analysis  
**FDF:** Finished Dosage Form  
**ROA:** Route of Administration  
**GAVI:** Global Alliance for Vaccines and Immunization  
**UNICEF:** United Nations Children's Fund  
**PAHO:** Pan American Health Organization  
**IM:** Intramuscular injection  
**SC:** Subcutaneous injection  
**KPI:** Key Performance Indicator  
**APAC:** Asia-Pacific region  

---

## CONTACT & SUPPORT

For questions about specific data points, methodologies, or custom analyses, please contact the dashboard administrator.

**Last Updated:** November 2024  
**Version:** 1.0  
**Data Range:** 2021-2035 (15 years)  
**Total Records:** 1.2M+ vaccine market transactions


