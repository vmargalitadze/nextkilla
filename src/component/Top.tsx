"use client";
import React from 'react'
import Image from 'next/image'
import { useTranslations } from "next-intl";

const destinations = [
    {
        name: "Rome, Italy",
        price: "$5.42k",
        days: "10 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg", // Replace with your actual image
    },
    {
        name: "London, UK",
        price: "$4.2k",
        days: "12 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg", // Replace with your actual image
    },
    {
        name: "Full Europe",
        price: "$15k",
        days: "28 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg", // Replace with your actual image
    },
]

const Top = () => {
    const t = useTranslations("top");
    return (
        <div className="container mx-auto pt-20 pb-20  relative">
            <div className="max-w-7xl mx-auto">


                <div className="mb-7 text-center">
                    <h5 className="text-primary font-semibold">{t("topSelling")}</h5>
                    <h3 className="text-[30px] sm:text-[35px] md:text-[48px] xl:text-[56px] font-black leading-[40px] sm:leading-[45px] md:leading-[58px] xl:leading-[68px]">
                        {t("topDestinations")}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 relative">
                    {destinations.map((dest, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <div className="relative w-full h-[500px]">
                                <Image
                                    src={dest.img}
                                    alt={dest.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex flex-col lg:flex-row justify-between mb-3">
                                    <h4 className="text-primary font-semibold text-lg">
                                        <a href="#!" className="hover:underline">
                                            {dest.name}
                                        </a>
                                    </h4>
                                    <span className="text-xl font-medium">{dest.price}</span>
                                </div>
                                <div className="flex gap-3 items-center mt-auto">
                                    <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                        <Image src="/send.svg" width={18} height={18} alt="" />
                                    </span>
                                    <span className="text-gray-700 font-medium">{dest.days}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Top