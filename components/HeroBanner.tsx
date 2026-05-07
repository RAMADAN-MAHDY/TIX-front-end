"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Banner } from "@/utils/Types/common";

const defaultBanners: Banner[] = [
  {
    id: 1,
    image: "",
    title: "وفر وقتك",
    subtitle: "واطلب مستلزماتك اونلاين",
    cta: "تسوق الآن",
    link: "/offers",
  },
];

export default function HeroBanner({ banners = defaultBanners }: { banners?: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 h-[400px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 flex items-center justify-center ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <div className="text-center text-white z-10 px-4">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
                {banner.title}
              </h1>
              <p className="text-xl sm:text-2xl text-balance mb-8">
                {banner.subtitle}
              </p>
              {banner.cta && (
                <Link
                  href={banner.link || "/"}
                  className="inline-block bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all active:scale-[0.97]"
                >
                  {banner.cta}
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
