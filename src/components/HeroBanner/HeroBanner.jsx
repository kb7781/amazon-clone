import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SLIDES = [
  {
    image: 'https://picsum.photos/seed/hero1/1500/500',
    title: 'Great Deals on Electronics',
    subtitle: 'Up to 40% off on top brands',
    link: '/products?category=1',
    color: 'from-blue-900/80',
  },
  {
    image: 'https://picsum.photos/seed/hero2/1500/500',
    title: 'New Arrivals in Fashion',
    subtitle: 'Explore the latest trends',
    link: '/products?category=3',
    color: 'from-purple-900/80',
  },
  {
    image: 'https://picsum.photos/seed/hero3/1500/500',
    title: 'Home & Kitchen Essentials',
    subtitle: 'Everything you need for your home',
    link: '/products?category=4',
    color: 'from-green-900/80',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay + text */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent flex items-center`}>
            <div className="px-8 md:px-16 max-w-lg">
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-white/90 text-sm md:text-lg mb-4 drop-shadow">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="btn-amazon-primary px-6 py-2.5 text-sm md:text-base inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-amazon scale-110' : 'bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Gradient fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#eaeded] to-transparent" />
    </div>
  );
}
