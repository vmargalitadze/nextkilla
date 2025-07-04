import React from 'react'

import Image from "next/image";
import { useTranslations } from "next-intl";
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

const Booking = () => {
    const t = useTranslations("booking");
    return (
        <div className="container mx-auto pt-20 pb-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-6/12">
                    <div className="mb-6">
                        <h5 className="text-red-400 text-[18px] font-semibold">{t("easy_fast")}</h5>
                        <h3 className="capitalize text-[30px] sm:text-[35px] md:text-[48px] xl:text-[56px] font-bold leading-tight">
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
                <div className="w-full lg:w-6/12 flex justify-center items-start">
                    <div className="relative shadow-lg rounded-2xl bg-white max-w-xs w-full overflow-hidden">
                       
                        <div className="relative z-10 p-4">
                            <Image
                                className="mb-4 mt-2 rounded-2xl w-full object-cover"
                                src="/booking-img.jpg"
                                width={350}
                                height={200}
                                alt="booking"
                            />
                            <div>
                                <h5 className="font-semibold text-lg">{t("trip_greece")}</h5>
                                <p className="text-gray-500 text-[18px] mb-3">{t("trip_dates")}</p>
                                <div className="flex gap-4 mb-4">
                                    <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                        <Image src="/leaf.svg" width={18} height={18} alt="" />
                                    </span>
                                    <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                        <Image src="/map.svg" width={18} height={18} alt="" />
                                    </span>
                                    <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                       <Image src="/send.svg" width={18} height={18} alt="" />
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full">
                                        <Image src="/building.svg" width={18} height={18} alt="building" />
                                        </div>
                                        <span className="text-gray-600 text-sm">{t("people_going")}</span>
                                    </div>

                                </div>
                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Booking
