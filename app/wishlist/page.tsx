'use client'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { Heart, Trash2, Star, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPrice } from '@/utils/helpers'

export default function WishlistPage() {
  const { items, isLoading, refreshWishlist } = useWishlist()
  const { state: authState } = useAuth()

  // Redirect if not logged in
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      window.location.href = '/login?redirect=/wishlist'
    }
  }, [authState.isLoading, authState.isAuthenticated])

  useEffect(() => {
    if (authState.isAuthenticated) {
      refreshWishlist()
    }
  }, [authState.isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-72 bg-white rounded-2xl shadow-sm border border-gray-50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">المفضلة ({items.length} منتج)</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6">
                  <Heart className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">قائمة المفضلة فارغة</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">لم تضف أي منتجات للمفضلة بعد. استكشف منتجاتنا الرائعة وأضف ما يعجبك هنا.</p>
                <Link href="/">
                  <Button className="bg-black text-white hover:bg-gray-800 px-10 rounded-xl h-12 font-bold text-lg transition-all shadow-lg shadow-black/10">
                    استكشف المتجر
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                      <Image
                        src={item.image || "/pl1.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm z-10">
                          {item.discount}%-
                        </div>
                      )}
                      <button
                        onClick={() => {}} 
                        className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-red-600 hover:scale-110 transition-all z-10"
                      >
                        <Heart className="w-4 h-4 fill-red-600" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 flex flex-col flex-1 space-y-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < (item.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 mr-1">({formatPrice(item.reviews || 0)})</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-gray-900">{formatCurrency(item.price)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button className="flex-1 bg-black hover:bg-gray-800 text-white text-[11px] h-9 font-bold rounded-lg transition-all">
                          أضف للسلة
                        </Button>
                        <button
                          onClick={() => {}} 
                          className="w-9 h-9 flex items-center justify-center border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="حذف من المفضلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
