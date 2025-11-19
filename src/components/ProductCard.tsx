import { Link } from 'react-router-dom'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image_url: string | null
  stock: number
  className?: string
}

export function ProductCard({ id, name, price, image_url, stock, className }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price)

  return (
    <Link to={`/products/${id}`} className={cn('block', className)}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">이미지 없음</div>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                품절
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{name}</h3>
          <p className="mb-2 text-lg font-bold text-primary">{formattedPrice}</p>
          <p className="text-xs text-muted-foreground">
            재고: {stock > 0 ? `${stock}개` : '품절'}
          </p>
        </div>
      </Card>
    </Link>
  )
}

