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

                    <div className="grid mt-10  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="group text-center p-4  transition duration-300">
                                <div className="relative group overflow-hidden rounded-full">
                                    <div className="relative group overflow-hidden rounded-full aspect-square w-[200px]">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover w-[200px] h-[200px] rounded-full transition-transform duration-300"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-[20px] font-bold bg-bodyColor py-[5px] px-[26px] rounded-r-[30px] text-primary absolute bottom-15 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in">
                                            {category.name} 
                                        </h2>
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