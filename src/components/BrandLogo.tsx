type BrandLogoProps = {
  className?: string
  size?: 'sm' | 'lg'
}

export function BrandLogo({ className = '', size = 'sm' }: BrandLogoProps) {
  return (
    <div
      className={`brand-lockup ${size} ${className}`.trim()}
      role="img"
      aria-label="لوگوی ابجد"
    >
      <span className="brand-mark">ابجد</span>
    </div>
  )
}
