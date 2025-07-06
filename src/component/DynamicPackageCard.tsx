"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

import { Calendar } from "lucide-react";



interface Package {
  id: number;
  title: string;
  price: number;
  duration: string;
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

interface DynamicPackageCardProps {
  packages: Package[];
}

const DynamicPackageCard: React.FC<DynamicPackageCardProps> = ({ packages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [randomizedPackages, setRandomizedPackages] = useState<Package[]>([]);

  // Initialize randomized packages on component mount
  useEffect(() => {
    if (packages.length > 0) {
      const shuffled = [...packages].sort(() => Math.random() - 0.5);
      setRandomizedPackages(shuffled);
    }
  }, [packages]);

  useEffect(() => {
    if (randomizedPackages.length === 0) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);

      // After fade out, change to next package
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomizedPackages.length);
        setIsVisible(true);
      }, 500); // Half of the total transition time
    }, 8000); // Change every 8 seconds (increased from 4)

    return () => clearInterval(interval);
  }, [randomizedPackages.length]);



  if (randomizedPackages.length === 0) {
    return (
      <div className="w-full lg:w-6/12 flex justify-center items-start">
        <div className="relative shadow-lg rounded-2xl bg-white max-w-xs w-full overflow-hidden">
          <div className="relative z-10 p-4">
            <div className="mb-4 mt-2 rounded-2xl w-full h-[200px] bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No packages available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPackage = randomizedPackages[currentIndex];

  return (
    <div className="w-full lg:w-6/12 flex justify-center items-start">
      <div className="relative shadow-lg rounded-2xl bg-white max-w-xs w-full overflow-hidden">
        <div className="relative z-10 p-4">
          {/* Image with fade animation */}
          <div className="mb-4 mt-2 rounded-2xl w-full overflow-hidden">
            {currentPackage.gallery[0]?.url ? (
              <div className="w-full aspect-[16/10] overflow-hidden">
                <Image
                  className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  src={currentPackage.gallery[0].url}
                  width={550}
                  height={550}
                  alt={currentPackage.title}
                />
              </div>
            ) : (
              <div className={`w-full h-[200px] bg-gray-200 flex items-center justify-center transition-all duration-1000 ease-in-out ${isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
                }`}>
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">No image</p>
                </div>
              </div>
            )}
          </div>

          {/* Content with fade animation */}
          <div className={`transition-all duration-1000 ease-in-out ${isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
            }`}>
            <h5 className="font-semibold text-lg text-gray-800">
              <Link href={`/product/${currentPackage.id}`} className="hover:text-red-400 transition-colors">
                {currentPackage.title}
              </Link>
            </h5>
            <div className="flex items-center gap-2 mb-4">
              <div className={`inline-flex items-center justify-center p-2 bg-gray-100 rounded-full transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                <Calendar width={18} height={18} />
              </div>
              <span className="text-gray-500 text-sm">
                {currentPackage.duration} DAYS
              </span>
            </div>
           

            {/* Icons with staggered animation */}
            <div className="flex gap-4 mb-4">
              <span className={`inline-flex items-center justify-center p-2 bg-gray-100 rounded-full transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                <Image src="/leaf.svg" width={18} height={18} alt="" />
              </span>
              <span className={`inline-flex items-center justify-center p-2 bg-gray-100 rounded-full transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                <Image src="/map.svg" width={18} height={18} alt="" />
              </span>
              <span className={`inline-flex items-center justify-center p-2 bg-gray-100 rounded-full transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                <Image src="/send.svg" width={18} height={18} alt="" />
              </span>
            </div>

            {/* Price and location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center justify-center p-2 bg-gray-100 rounded-full transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>
                  <Image src="/building.svg" width={18} height={18} alt="building" />
                </div>
                <span className={`text-gray-600 text-sm transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                  {currentPackage.location?.name || 'Location'}
                </span>
              </div>
              <span className={`text-red-400 font-semibold text-lg transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}>
                ${currentPackage.price}
              </span>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DynamicPackageCard; 