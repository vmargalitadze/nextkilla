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
  description: string;
  price: number;
  salePrice?: number | null;
  duration: string;
  startDate?: Date | null;
  endDate?: Date | null;
  byBus: boolean;
  byPlane: boolean;
  category: string;
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
    city: string;
  };
  dates?: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    maxPeople: number;
  }>;
}

interface TopProps {
  locale?: string;
}

const Top: React.FC<TopProps> = ({ locale = 'en' }) => {
  const t = useTranslations("top");
  const [popularPackages, setPopularPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Map app locale to date locale
  const dateLocale = locale === 'ge' ? 'ka-GE' : 'en-US';
  
  // Debug logging
  console.log('Top component - locale prop:', locale);
  console.log('Top component - dateLocale:', dateLocale);

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
                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <div className="relative w-full h-[300px]">
                    {pkg.gallery && pkg.gallery.length > 0 ? (
                      <Image
                        src={pkg.gallery[0].url}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    {pkg.popular && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Popular
                      </div>
                    )}
                    {/* Transport type indicator */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                      {pkg.byBus ? "🚌" : pkg.byPlane ? "✈️" : ""}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col lg:flex-row justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 lg:mb-0">
                        {pkg.title}
                      </h3>
                      <div className="text-right">
                        {pkg.salePrice ? (
                          <div>
                            <span className="text-lg font-bold text-red-600">
                              ₾{pkg.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₾{pkg.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₾{pkg.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4">{pkg.location?.name || ""}</span>
                      <span>{pkg.location?.country || ""}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {pkg.byBus ? "🚌" : "✈️"} {pkg.category}
                        </span>
                      </div>
                      <Link
                        href={`/product/${pkg.id}`}
                        className="w-[50%] text-[16px] bg-red-400 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
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
