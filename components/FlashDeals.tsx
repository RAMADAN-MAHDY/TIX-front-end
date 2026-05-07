"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Zap, ChevronRight, ChevronLeft } from "lucide-react";
import api from "@/lib/api";
import type { ProductCardProps } from "@/utils/Types/products";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function FlashDeals() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await api.get("/product/discounted");
        if (response.data.status && response.data.data) {
          const data = Array.isArray(response.data.data) ? response.data.data : response.data.data.data;
          if (Array.isArray(data) && data.length > 0) {
            setProducts(
              data.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                price: p.price_after || p.price,
                originalPrice: p.price_before,
                image: p.images?.[0] || p.image || "/pl1.jpg",
                discount: p.discount || 0,
                rating: p.reviews?.average_rating || 0,
                reviewsCount: p.reviews?.count || 0,
              })),
            );
            return;
          }
        }
      } catch {
        // Use defaults
      }
      setProducts([
        { id: "f1", name: "سماعات لاسلكية برو", price: 199, originalPrice: 399, image: "/pl1.jpg", discount: 50 },
        { id: "f2", name: "شاحن سريع 65W", price: 149, originalPrice: 299, image: "/pl2.jpg", discount: 50 },
        { id: "f3", name: "كيبل شحن سريع", price: 49, originalPrice: 99, image: "/pl1.jpg", discount: 50 },
        { id: "f4", name: "حامل هاتف للسيارة", price: 79, originalPrice: 159, image: "/pl2.jpg", discount: 50 },
        { id: "f5", name: "باور بانك 20000", price: 299, originalPrice: 599, image: "/pl1.jpg", discount: 50 },
        { id: "f6", name: "ماوس ألعاب لاسلكي", price: 120, originalPrice: 240, image: "/pl2.jpg", discount: 50 },
      ]);
    }
    fetchDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else hours = 23;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (products.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-12 overflow-hidden border-y border-red-900/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2.5 rounded-xl rotate-12 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">عروض الفلاش</h2>
              <p className="text-red-500 text-xs md:text-sm font-medium mt-0.5">خصومات تصل إلى 70% لفترة محدودة</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 px-4 rounded-2xl border border-zinc-800/50">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest hidden sm:inline">ينتهي في</span>
            <div className="flex gap-2.5">
              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((v, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="bg-zinc-800 text-white w-11 h-11 flex items-center justify-center rounded-xl font-mono font-bold text-xl border border-zinc-700 shadow-lg">
                    {pad(v)}
                  </div>
                  {i < 2 && <span className="text-red-600 font-black animate-pulse">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group px-2 md:px-10">
          <Swiper
            dir="rtl"
            modules={[Navigation, Autoplay]}
            spaceBetween={15}
            slidesPerView={2}
            loop={products.length > 5}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 12 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="w-full"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="h-full py-2">
                  <ProductCard {...product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Corrected Navigation Buttons Positioning */}
          <button className="swiper-button-prev-custom absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2.5 md:p-3 rounded-full shadow-2xl hover:bg-red-600 hover:text-white flex items-center justify-center border border-zinc-200 transition-all active:scale-90">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button className="swiper-button-next-custom absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2.5 md:p-3 rounded-full shadow-2xl hover:bg-red-600 hover:text-white flex items-center justify-center border border-zinc-200 transition-all active:scale-90">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
