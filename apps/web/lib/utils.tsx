import { cn } from '@repo/ui/lib/utils'
import slug from 'slug'

export const generateGradient = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color =
    '#' +
    ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
    ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
    ((hash >> 8) & 0xff).toString(16).padStart(2, '0') +
    (hash & 0xff).toString(16).padStart(2, '0')
  return color.slice(0, 7)
}

export const generateAvatar = (seed: string, className?: string): React.ReactNode => {
  const color1 = generateGradient(seed + seed)
  const color2 = generateGradient(seed + seed + seed)

  return (
    <svg className={cn('w-full h-full', className)} xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 700 700' width='700' height='700'>
      <defs>
        <linearGradient gradientTransform='rotate(150, 0.5, 0.5)' x1='50%' y1='0%' x2='50%' y2='100%' id={`${color1}-gradient`}>
          <stop stopColor={color1} stopOpacity='1' offset='0%' />
          <stop stopColor={color2} stopOpacity='1' offset='100%' />
        </linearGradient>
        <filter
          id={`${color1}-filter`}
          x='-20%'
          y='-20%'
          width='140%'
          height='140%'
          filterUnits='objectBoundingBox'
          primitiveUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.005 0.003'
            numOctaves='2'
            seed='221'
            stitchTiles='stitch'
            x='0%'
            y='0%'
            width='100%'
            height='100%'
            result='turbulence'
          />
          <feGaussianBlur stdDeviation='20 0' x='0%' y='0%' width='100%' height='100%' in='turbulence' edgeMode='duplicate' result='blur' />
          <feBlend mode='color-dodge' x='0%' y='0%' width='100%' height='100%' in='SourceGraphic' in2='blur' result='blend' />
        </filter>
      </defs>
      <rect width='700' height='700' fill={`url(#${color1}-gradient)`} filter={`url(#${color1}-filter)`} />
    </svg>
  )
}

export const generateRandomId = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

export const generateGameSlug = (title: string) => {
  return slug(title, { lower: true }).concat('-', generateRandomId(8))
}
