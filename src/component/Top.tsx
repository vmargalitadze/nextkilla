"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "@/i18n/navigation";
import { getAllPackages } from "@/lib/actions/packages";

interface Package {
  id: number;
  title: string;
  price: number;
  duration: string;
  popular?: boolean;
  gallery: Array<{
    id: number;
    url: string;
    packageId: number;
  }>;
  location?: {
    id: number;
    name: string;
    country: string;
  };
}

const Top = () => {
  const t = useTranslations("top");
  const [popularPackages, setPopularPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPackages = async () => {
      try {
        const popularResult = await getAllPackages();
        
        if (popularResult.success) {
          // Filter packages where popular is true
          const popularOnly = popularResult.data?.filter((pkg: unknown) => (pkg as Package).popular === true) || [];
          setPopularPackages(popularOnly as Package[]);
        }
      } catch (error) {
        console.error("Error fetching popular packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPackages();
  }, []);

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      // Cleanup any Swiper instances if needed
    };
  }, []);

  return (
    <>
      <div className="max-w-7xl pt-15  mx-auto">
        <div className="">
          <div className="mb-7 text-center">
            <h5 className="text-red-400 text-[22px] font-semibold">{t("subtitle")}</h5>
            <h3 className="capitalize  font-[Salsa,cursive] text-[30px] md:text-[40px] md:text-6xl">
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
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="relative w-full h-[500px]">
                      <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    </div>
                    <div className="p-6 flex rounded-lg flex-col flex-1">
                      <div className="flex flex-col lg:flex-row justify-between mb-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="flex gap-3 items-center mt-auto">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              popularPackages.map((pkg, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white hover:shadow-xl hover:-translate-y-1 mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <div className="relative w-full h-[500px]">
                    <Image
                      src={pkg.gallery[0]?.url || "/category/photo-1532254497630-c74966e79621.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6 flex rounded-lg flex-col flex-1">
                    <div className="flex flex-col lg:flex-row justify-between mb-3">
                      <h4 className="text-red-400 font-semibold text-[18px]">
                        <Link
                          href={`/product/${pkg.id}`}
                        >
                          {pkg.title}
                        </Link>
                      </h4>
                      <span className="text-[18px] font-medium">
                        ${pkg.price}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center mt-auto">
                      <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                        <Image src="/send.svg" width={18} height={18} alt="" />
                      </span>
                      <span className="text-gray-700 text-[18px] font-medium">
                        {pkg.duration}
                      </span>
                    </div>
                    <Link
                      href={`/product/${pkg.id}`}
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
            ))
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Top;
