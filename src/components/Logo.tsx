export function Logo({ isCollapsed = false }: { isCollapsed?: boolean }) {
  if (isCollapsed) {
    return null
  }
  
  return (
    <div className="flex items-center w-full">
      <img 
        src="/logo.png" 
        alt="Coherent Market Insights" 
        className="h-10 w-auto object-contain max-w-full"
        onError={(e) => {
          // Fallback to text if image not found
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const fallback = target.nextElementSibling as HTMLElement
          if (fallback) fallback.style.display = 'flex'
        }}
      />
      <div className="flex flex-col hidden" style={{ display: 'none' }}>
        <span className="text-lg font-sans text-[#1a237e] font-bold leading-tight uppercase">
          COHERENT
        </span>
        <span className="text-xs font-sans text-[#1a237e] tracking-[0.15em] leading-tight uppercase">
          MARKET INSIGHTS
        </span>
      </div>
    </div>
  )
}

