"use client";
import { useTranslations } from "next-intl";
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { getAllCategories, getCategoryStats } from "@/lib/actions/categories";

interface CategoryStats {
  category: string;
  count: number;
}

import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Category images mapping
const categoryImages = {
  "Cultural": "/category/photo-1532254497630-c74966e79621.jpg",
  "Adventure": "/category/photo-1532254497630-c74966e79621.jpg", 
  "Historical": "/category/photo-1532254497630-c74966e79621.jpg",
  "Culinary": "/category/photo-1532254497630-c74966e79621.jpg",
  "Beach": "/category/photo-1532254497630-c74966e79621.jpg",
  "Ski": "/category/photo-1532254497630-c74966e79621.jpg",
  "Eco": "/category/photo-1532254497630-c74966e79621.jpg",
  "Religious": "/category/photo-1532254497630-c74966e79621.jpg",
  "Shopping": "/category/photo-1532254497630-c74966e79621.jpg",
  "Wellness": "/category/photo-1532254497630-c74966e79621.jpg",
  "Photography": "/category/photo-1532254497630-c74966e79621.jpg",
  "Weekend": "/category/photo-1532254497630-c74966e79621.jpg",
  "International": "/category/photo-1532254497630-c74966e79621.jpg",
  "Domestic": "/category/photo-1532254497630-c74966e79621.jpg",
};



const Category = () => {
    const t = useTranslations("category");
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResult = await getAllCategories();
                const statsResult = await getCategoryStats();
              
                
                if (categoriesResult.success && categoriesResult.data) {
                    setCategories([...categoriesResult.data]);
                }
                
                if (statsResult.success) {
                    setCategoryStats(statsResult.data || []);
                }

                
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        // Cleanup function to prevent memory leaks
        return () => {
            // Cleanup any Swiper instances if needed
        };
    }, []);

    return (
        <>
            <div className="container mx-auto ">

                <div className="max-w-7xl   mx-auto">
                    <div className="flex justify-center items-center text-center flex-col gap-[5px] sm:gap-[8px] md:gap-[15px] ">
                        <div className="flex justify-center items-center text-center flex-col gap-[9px]">
                            <h1 className="capitalize font-[Salsa,cursive] text-[30px] md:text-[40px] ">
                                {t("title")}
                            </h1>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
                                        <div className="relative aspect-square overflow-hidden">
                                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={16}
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                            }}
                            modules={[Pagination]}
                            className="category-swiper mt-16"
                        >
                            {categories
                                .map((category, index) => {
                                    const stats = categoryStats.find(stat => stat.category === category);
                                    const packageCount = stats?.count || 0;
                                    
                                    return { category, packageCount, index };
                                })
                                .filter(item => item.packageCount > 0) // Only show categories with packages
                                .map(({ category, packageCount, index }) => (
                                    <SwiperSlide key={index}>
                                        <div className="mb-5 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                            <div className="relative w-full h-[300px]">
                                                <Image
                                                    src={categoryImages[category as keyof typeof categoryImages] || "/category/photo-1532254497630-c74966e79621.jpg"}
                                                    alt={category}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex flex-col lg:flex-row justify-between mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 lg:mb-0">
                                                        {category}
                                                    </h3>
                                                    <div className="text-right">
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {packageCount} Tours
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500">
                                                            {category}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={`/travels?category=${category}`}
                                                        className="w-[50%] text-[16px] bg-red-400 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                                                    >
                                                        {t("viewDetails")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    )}




                </div>
            </div>


        </>
    )
}

export default Category