"use client";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAllPackages } from "@/lib/actions/packages";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar } from "lucide-react";

interface Package {
  id: number;
  title: string;
  price: number;
  duration: string;
  startDate?: Date | null;
  endDate?: Date | null;
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
}

interface DestProps {
  locale?: string;
}

function Dest({ locale = 'en' }: DestProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("newDest");

  // Map app locale to date locale
  const dateLocale = locale === 'ge' ? 'ka-GE' : 'en-US';

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesResult = await getAllPackages();
        if (packagesResult.success) {
          setPackages(packagesResult.data || []);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);


    if (loading) {
    return (
      <div className="max-w-7xl pt-15 mx-auto">
        <div className="mb-7 text-center">
          <h3 className="capitalize font-[Salsa,cursive] text-[30px] md:text-[40px] md:text-6xl">
            {t("title")}
          </h3>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl pt-15 mx-auto">
        <div className="mb-7 text-center">
          <h3 className="capitalize font-[Salsa,cursive] text-[30px] md:text-[40px] md:text-6xl">
            {t("title")}
          </h3>
        </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Pagination]}
        className="partner-swiper"
      >
        {packages.map((package_, idx) => (
          <SwiperSlide key={package_.id}>
            <div
              className="bg-white mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                animationDelay: `${idx * 0.1}s`,
                animationName: "fadeInUp",
                animationDuration: "0.6s",
                animationFillMode: "both",
              }}
            >
              <div className="relative hover:shadow-xl hover:-translate-y-1 w-full h-[500px]">
                {package_.gallery[0]?.url ? (
                  <Image
                    src={package_.gallery[0].url}
                    alt={package_.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex rounded-lg flex-col flex-1">
                <div className="flex flex-col lg:flex-row justify-between mb-3">
                  <h4 className="text-red-400 font-semibold text-[18px]">
                    <Link
                      href={`/product/${package_.id}`}
                     
                    >
                      {package_.title}
                    </Link>
                  </h4>
                  <span className="text-[18px] font-medium">
                    ₾{package_.price}
                  </span>
                </div>

                <div className="flex gap-3 items-center mt-auto">
                  <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                  <Calendar width={18} height={18} />
                  </span>
                  <span className="text-gray-700 text-sm">
                    {package_.startDate && package_.endDate ? `${package_.startDate.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })} - ${package_.endDate.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}` : package_.duration}
                  </span>
                </div>
                <Link
                  href={`/product/${package_.id}`}
                  className="explore-btn gap-3 group mt-4 inline-flex items-center text-[#f09819] font-semibold "
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
    </div>
    </>
  );
}

export default Dest;
