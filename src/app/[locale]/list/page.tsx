"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllPackages } from "@/lib/actions/packages";
import { Link } from "@/i18n/navigation";
import Image from 'next/image';


import { CATEGORIES } from "@/lib/Validation";


interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  duration: string;
  category: string;
  popular: boolean;
  location: {
    id: number;
    name: string;
    country: string;
  };
  gallery: Array<{
    id: number;
    url: string;
    packageId: number;
  }>;
}

export default function ListPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showPopularOnly, setShowPopularOnly] = useState(false);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const result = await getAllPackages();
        if (result.success) {
          setPackages(result.data as unknown as Package[] || []);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }

    // Filter by destination
    if (selectedDestination) {
      filtered = filtered.filter(pkg => pkg.location.name.toLowerCase().includes(selectedDestination.toLowerCase()));
    }

    // Filter by duration
    if (selectedDuration) {
      filtered = filtered.filter(pkg => pkg.duration.toLowerCase().includes(selectedDuration.toLowerCase()));
    }

    // Filter by popularity
    if (showPopularOnly) {
      filtered = filtered.filter(pkg => pkg.popular === true);
    }

    // Filter by price range
    filtered = filtered.filter(pkg => {
      const price = pkg.salePrice || pkg.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredPackages(filtered);
  }, [packages, selectedCategory, selectedDestination, selectedDuration, showPopularOnly, priceRange]);

  if (loading) {
    return (
      <>
     
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Sidebar skeleton */}
              <div className="w-80 hidden lg:block">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Content skeleton */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col">
                      <div className="relative w-full h-[300px]">
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }

  return (
    <>
          <div className="w-full lg:py-36 py-16 sm:py-20 relative overflow-hidden">
        <div className="jarallax absolute inset-0 z-minus" data-jarallax="">
          <div className="relative w-full min-h-[300px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[750px] xl:h-[850px] overflow-hidden">
            <div className="absolute w-full inset-0 -z-10">
              <div className="relative w-full min-h-[300px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[750px] xl:h-[850px]">
                <Image
                  src="/breadcrumb-bg.webp"
                  alt="placeholder"
                  fill
                  className="object-cover pointer-events-none"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
              </div>
            </div>
          </div>
        </div>
        <Image
          src="/bird-illustration-w.png"
          alt="placeholder"
          width={100}
          height={100}
          className="absolute top-[5%] right-[8%] z-1 w-[16vw] max-w-[100px] min-w-[60px]"
        />
      </div>
        
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">


          {/* Header */}


          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-80 hidden lg:block">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Filter by:</h3>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Filter Price:</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Popularity Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Popularity</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPopularOnly}
                      onChange={(e) => setShowPopularOnly(e.target.checked)}
                      className="text-red-400 focus:ring-red-400"
                    />
                    <span className="text-gray-600">Popular packages only</span>
                  </label>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {CATEGORIES
                      .map((cat) => {
                        const packageCount = packages.filter(pkg => pkg.category === cat).length;
                        return { category: cat, count: packageCount };
                      })
                      .filter(item => item.count > 0)
                      .map(({ category, count }) => (
                        <label key={category} className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={selectedCategory === category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="text-red-400 focus:ring-red-400"
                            />
                            <span className="text-gray-600">{category}</span>
                          </div>
                          <span className="text-xs text-gray-400">({count})</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Destinations */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Destinations</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(packages.map(pkg => pkg.location.name))).map((dest) => (
                      <label key={dest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="destination"
                          value={dest}
                          checked={selectedDestination === dest}
                          onChange={(e) => setSelectedDestination(e.target.value)}
                          className="text-red-400 focus:ring-red-400"
                        />
                        <span className="text-gray-600">{dest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Duration</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(packages.map(pkg => pkg.duration))).map((duration) => (
                      <label key={duration} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="duration"
                          value={duration}
                          checked={selectedDuration === duration}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="text-red-400 focus:ring-red-400"
                        />
                        <span className="text-gray-600">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedDestination('');
                    setSelectedDuration('');
                    setShowPopularOnly(false);
                    setPriceRange([0, 10000]);
                  }}
                  className="w-full bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>




            {/* Content */}
            <div className="flex-1">
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏖️</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">No packages found</h2>
                  <p className="text-gray-600 mb-6">
                    No packages match your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedDestination('');
                      setSelectedDuration('');
                      setShowPopularOnly(false);
                      setPriceRange([0, 10000]);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-white hover:shadow-xl hover:-translate-y-1 mb-24 rounded-lg shadow-lg overflow-hidden flex flex-col">
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={pkg.gallery[0]?.url || "/category/photo-1532254497630-c74966e79621.jpg"}
                          alt={pkg.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        {pkg.popular && (
                          <div className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        )}
                        {pkg.salePrice && (
                          <div className="absolute top-2 left-2 bg-green-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex rounded-lg flex-col flex-1">
                        <div className="flex flex-col lg:flex-row justify-between mb-3">
                          <h4 className="text-red-400 font-semibold text-[18px]">
                            <Link href={`/product/${pkg.id}`}>
                              {pkg.title}
                            </Link>
                          </h4>
                          <span className="text-[18px] font-medium">
                            ${pkg.salePrice || pkg.price}
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
                          className="explore-btn gap-3 group mt-4"
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 