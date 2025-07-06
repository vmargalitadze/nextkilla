"use client";
import { useTranslations } from "next-intl";
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { getAllCategories, getCategoryStats } from "@/lib/actions/categories";

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
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryStats, setCategoryStats] = useState<any[]>([]);
    const [ setPopularPackages] = useState<any[]>([]);
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
                                        <div className="bg-white mb-24 hover:shadow-xl hover:-translate-y-1 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                            <div className="relative w-full h-[500px]">
                                                <Image
                                                    src={categoryImages[category as keyof typeof categoryImages] || "/category/photo-1532254497630-c74966e79621.jpg"}
                                                    alt={category}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                />
                                                {/* Package Count Badge */}
                                                <div className="absolute top-4 right-4 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    {packageCount} packages
                                                </div>
                                            </div>
                                            <div className="p-6 flex rounded-lg flex-col flex-1">
                                                <div className="flex flex-col lg:flex-row justify-between mb-3">
                                                    <h4 className="text-red-400 font-semibold text-[18px]">
                                                        <Link
                                                            href={`/list?category=${category}`}
                                                           
                                                        >
                                                            {category}
                                                        </Link>
                                                    </h4>
                                                    <span className="text-[18px] font-medium">
                                                        {packageCount} Tours
                                                    </span>
                                                </div>
                                                <div className="flex gap-3 items-center mt-auto">
                                                    <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                                        <Image src="/send.svg" width={18} height={18} alt="" />
                                                    </span>
                                                    <span className="text-gray-700 text-[18px] font-medium">
                                                        Explore {category}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/list?category=${category}`}
                                                    className="explore-btn gap-3 group"
                                                >
                                                    <span>Explore Now</span>
                                                    <div className="max-w-[24px]">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="text-[#f09819]"
                                                            width="27"
                                                            height="14"
                                                            viewBox="0 0 27 14"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M0.217443 6.25H18.4827C18.6276 6.25 18.7001 6.30263 18.7001 6.40789V7.59211C18.7001 7.69737 18.6276 7.75 18.4827 7.75H0.217443C0.0724811 7.75 0 7.69737 0 7.59211V6.40789C0 6.30263 0.0724811 6.25 0.217443 6.25Z"
                                                                fill="currentColor"
                                                            />
                                                            <path
                                                                d="M20.7001 12.28L25.0467 7.9333C25.5601 7.41997 25.5601 6.57997 25.0467 6.06664L20.7001 1.71997"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </Link>
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