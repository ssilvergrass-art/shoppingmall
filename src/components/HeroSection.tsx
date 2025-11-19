import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from './ui/button'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
  {
    id: 1,
    title: '겨울 신상 최대 80% 할인',
    buttonText: '쇼핑하기',
    buttonAction: () => console.log('쇼핑하기 클릭'),
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
  },
  {
    id: 2,
    title: '무료 배송 이벤트',
    buttonText: '자세히 보기',
    buttonAction: () => console.log('자세히 보기 클릭'),
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  },
  {
    id: 3,
    title: '회원가입 시 10% 쿠폰',
    buttonText: '가입하기',
    buttonAction: () => console.log('가입하기 클릭'),
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop',
  },
]

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true)
  const swiperRef = useRef<SwiperType | null>(null)

  const handlePlayPause = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay?.stop()
      } else {
        swiperRef.current.autoplay?.start()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    swiperRef.current?.slideNext()
  }

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={false}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="relative h-[600px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
                <h2 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
                  {slide.title}
                </h2>
                <Button
                  onClick={slide.buttonAction}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 화살표 */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* 일시정지/재생 버튼 */}
      <button
        onClick={handlePlayPause}
        className="absolute bottom-20 right-4 z-20 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-gray-800" />
        ) : (
          <Play className="h-5 w-5 text-gray-800" />
        )}
      </button>

      {/* 커스텀 인디케이터 스타일 */}
      <style>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active-custom {
          background: white;
          width: 32px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  )
}

