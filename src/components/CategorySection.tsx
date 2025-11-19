import { Smartphone, Shirt, Sparkles, Utensils, Dumbbell, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  {
    id: 1,
    name: '전자기기',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: '패션의류',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: '뷰티',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: '식품',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: '스포츠',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: '홈/리빙',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
  },
]

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">카테고리</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-4 rounded-lg border bg-white p-8 transition-all duration-300',
                'hover:bg-primary hover:text-white hover:shadow-lg hover:border-primary',
              )}
            >
              <Icon className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

