"use client";
import { useTranslations } from "next-intl";
import Image from 'next/image'
import React from 'react'

const categories = [
    {
        id: 1,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },
    {
        id: 2,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },
    {
        id: 3,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },
    {
        id: 4,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },




]



const Category = () => {
    const t = useTranslations("category");
    return (
        <>
            <div className="container mx-auto py-10">

                <div className="max-w-7xl pt-20  mx-auto">
                    <div className="flex justify-center items-center text-center flex-col gap-[5px] sm:gap-[8px] md:gap-[15px] ">
                        <div className="flex justify-center items-center text-center flex-col gap-[9px]">
                            <h1 className="text-[30px] sm:text-[35px] md:text-[48px] xl:text-[56px] font-black leading-[40px] sm:leading-[45px] md:leading-[58px] xl:leading-[68px]">
                                {t("title")}
                            </h1>
                        </div>
                    </div>

                    <div className="grid mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {categories.map((category) => (
                            <div key={category.id} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm  transition-all duration-500 transform hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0  transition-opacity duration-500"></div>
                                        
                                        {/* Category Name Overlay */}
                                        <div className="absolute inset-0 flex items-end p-6">
                                           
                                        </div>
                                    </div>
                                    
                                  
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-gray-800 font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                                                {category.name}
                                            </h4>
                                            <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>




                </div>
            </div>


        </>
    )
}

export default Category