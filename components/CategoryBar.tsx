"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { CategoryNavItem } from "@/utils/Types/navigation";

const fallbackCategories: CategoryNavItem[] = [
  { id: "1", name: "الإلكترونيات", slug: "electronics" },
  { id: "2", name: "الأزياء", slug: "fashion" },
  { id: "3", name: "المنزل والمطبخ", slug: "home-kitchen" },
  { id: "4", name: "الكتب", slug: "books" },
  { id: "5", name: "الألعاب", slug: "toys" },
  { id: "6", name: "الرياضة", slug: "sports" },
  { id: "7", name: "الجمال", slug: "beauty" },
  { id: "8", name: "الأطفال", slug: "baby" },
  { id: "9", name: "الأثاث", slug: "furniture" },
  { id: "10", name: "البقالة", slug: "grocery" },
  { id: "11", name: "السيارات", slug: "automotive" },
  { id: "12", name: "الحدائق", slug: "garden" },
];

export default function CategoryBar() {
  const [categories, setCategories] = useState<CategoryNavItem[]>(fallbackCategories);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categories");
        if (response.data.status && Array.isArray(response.data.data)) {
          const fetched: CategoryNavItem[] = response.data.data.map((cat: any) => ({
            id: String(cat.id),
            name: typeof cat.name === 'object' ? (cat.name.ar || cat.name.en) : cat.name,
            slug: cat.id,
          }));
          if (fetched.length > 0) setCategories(fetched);
        }
      } catch {
        // Use fallback
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="bg-muted/30 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 overflow-x-auto py-3 scrollbar-hide">
          <Link href="/offers" className="text-sm font-bold whitespace-nowrap text-primary hover:text-primary/80 transition-colors">
            عروضنا
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug || category.id}`}
              className="text-sm font-medium whitespace-nowrap text-gray-700 hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
