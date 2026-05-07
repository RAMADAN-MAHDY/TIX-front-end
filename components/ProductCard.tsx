"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, calculateDiscount, t } from "@/utils/helpers";
import { toast } from "react-toastify";
import type { ProductCardProps } from "@/utils/Types/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewsCount,
  discount,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { state: authState } = useAuth();

  const discountPct = discount || calculateDiscount(originalPrice || 0, price);
  const wishlisted = isInWishlist(id);
  const productName = t(name);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authState.isAuthenticated) {
      toast.info("سجّل الدخول أولاً لإضافة المنتجات للسلة");
      return;
    }
    try {
      await addToCart(id);
      toast.success("تمت الإضافة للسلة");
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authState.isAuthenticated) {
      toast.info("سجّل الدخول أولاً");
      return;
    }
    try {
      await toggleWishlist(id);
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <Link href={`/product/${id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full border border-gray-200 py-0 gap-0">
        <div className="relative h-40 w-full bg-gray-50">
          <Image
            src={image || "/pl1.jpg"}
            alt={productName}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discountPct > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {discountPct}%
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10 shadow-sm"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-medium text-[13px] mb-1.5 line-clamp-2 text-gray-800 h-9 leading-tight">{productName}</h3>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 ${
                  i < (rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-red-600 font-bold text-sm">{formatCurrency(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-gray-400 line-through text-[10px]">{formatCurrency(originalPrice)}</span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full text-[11px] h-8 bg-black hover:bg-gray-800 text-white rounded-md"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              أضف للسلة
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
