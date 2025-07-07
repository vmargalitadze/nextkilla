"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useTranslations } from "next-intl";

import { getAllPackages } from "@/lib/actions/packages";
import DynamicPackageCard from "./DynamicPackageCard";

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
  };
}

const steps = [
  {
    icon: "/selection.svg",
    title: "step1_title",
    desc: "step1_desc",
    bg: "bg-blue-500",
  },
  {
    icon: "/water-sport.svg",
    title: "step2_title",
    desc: "step2_desc",
    bg: "bg-blue-500",
  },
  {
    icon: "/taxi.svg",
    title: "step3_title",
    desc: "step3_desc",
    bg: "bg-teal-500",
  },
];

interface BookingProps {
  locale?: string;
}

function Booking({ locale = 'en' }: BookingProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("booking");



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

    return (
        <div className="container mx-auto pt-15 pb-13">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-6/12">
                    <div className="mb-6">
                        <h5 className="text-red-400 text-[22px] font-semibold">{t("easy_fast")}</h5>
                        <h3 className=" capitalize  font-[Salsa,cursive] text-[30px] md:text-[40px]">
                            {t("title")}
                        </h3>
                    </div>
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-start mb-6">
                            <div className={`${step.bg} p-3 rounded-xl flex-shrink-0`}>
                                <Image src={step.icon} width={22} height={22} alt="step icon" />
                            </div>
                            <div className="ml-4 flex-1">
                                <h5 className="text-gray-700 text-[18px] font-semibold">{t(step.title)}</h5>
                                <p className="text-gray-500 text-[16px]">{t(step.desc)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {loading ? (
                    <div className="w-full lg:w-6/12 flex justify-center items-start">
                        <div className="relative shadow-lg rounded-2xl bg-white max-w-xs w-full overflow-hidden">
                            <div className="relative z-10 p-4">
                                <div className="mb-4 mt-2 rounded-2xl w-full h-[200px] bg-gray-200 animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <DynamicPackageCard packages={packages} locale={locale} />
                )}
            </div>
        </div>
    )
}
export default Booking
