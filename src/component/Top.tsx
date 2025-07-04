"use client";
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from '@/i18n/navigation';

const destinations = [
    {
        name: "Rome, Italy",
        price: "$5.42k",
        days: "10 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
    {
        name: "London, UK",
        price: "$4.2k",
        days: "12 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
    {
        name: "Full Europe",
        price: "$15k",
        days: "28 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
    {
        name: "Full Europe",
        price: "$15k",
        days: "28 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
    {
        name: "Full Europe",
        price: "$15k",
        days: "28 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
    {
        name: "Full Europe",
        price: "$15k",
        days: "28 Days Trip",
        img: "/category/photo-1532254497630-c74966e79621.jpg",
    },
]

const Top = () => {
    const t = useTranslations("top");

    useEffect(() => {
        // Cleanup function to prevent memory leaks
        return () => {
            // Cleanup any Swiper instances if needed
        };
    }, []);

    return (
        <>
            <div className="max-w-[1570px] mx-auto px-3">
                <div className="pt-20">
                    <div className="mb-7 text-center">
                        <h5 className="text-red-400 font-semibold">{t("subtitle")}</h5>
                        <h3 className="text-[30px] sm:text-[35px] md:text-[48px] xl:text-[56px] font-black leading-[40px] sm:leading-[45px] md:leading-[58px] xl:leading-[68px]">
                            {t("title")}
                        </h3>
                    </div>
                    
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
                        className="partner-swiper"
                    >
                        {destinations.map((dest, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="bg-white mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <div className="relative w-full h-[500px]">
                                        <Image
                                            src={dest.img}
                                            alt={dest.name}
                                            fill
                                            className="object-cover rounded-t-lg"
                                        />
                                    </div>
                                    <div className="p-6 flex rounded-lg flex-col flex-1">
                                        <div className="flex flex-col lg:flex-row justify-between mb-3">
                                            <h4 className="text-red-400 font-semibold text-[18px]">
                                                <Link href="#!" className="hover:underline">
                                                    {dest.name}
                                                </Link>
                                            </h4>
                                            <span className="text-[18px] font-medium">{dest.price}</span>
                                        </div>
                                        <div className="flex gap-3 items-center mt-auto">
                                            <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                                <Image src="/send.svg" width={18} height={18} alt="" />
                                            </span>
                                            <span className="text-gray-700 text-[18px] font-medium">{dest.days}</span>
                                        </div>
                                        <Link href="package-details.html" className="explore-btn gap-3 group">
                                            <span>Explore Now</span>
                                            <div className="max-w-[24px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className='text-[#f09819]' width="27" height="14" viewBox="0 0 27 14" fill="none">
                                                    <path d="M0.217443 6.25H18.4827C18.6276 6.25 18.7001 6.30263 18.7001 6.40789V7.59211C18.7001 7.69737 18.6276 7.75 18.4827 7.75H0.217443C0.0724811 7.75 0 7.69737 0 7.59211V6.40789C0 6.30263 0.0724811 6.25 0.217443 6.25Z" fill="currentColor" />
                                                    <path d="M20.7001 12.28L25.0467 7.9333C25.5601 7.41997 25.5601 6.57997 25.0467 6.06664L20.7001 1.71997" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default Top