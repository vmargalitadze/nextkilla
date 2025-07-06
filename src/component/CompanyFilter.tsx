/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/Validation";
import { getAllPackages } from "@/lib/actions/packages";

function CompanyFilter() {
  const t = useTranslations("companyFilter");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [category, setCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages and filter categories
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const result = await getAllPackages();
        if (result.success && result.data) {
          const packages = result.data;
          
          // Count packages per category
          const categoryCounts = CATEGORIES.map(cat => ({
            category: cat,
            count: packages.filter((pkg: any) => pkg.category === cat).length
          }));
          
          // Filter categories with packages > 0
          const categoriesWithPackages = categoryCounts
            .filter(item => item.count > 0)
            .map(item => item.category);
          
          setAvailableCategories(categoriesWithPackages);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (priceRange) {
      params.append("price", priceRange);
    }
    if (category) {
      params.append("category", category);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/list?${queryString}` : "/list";
    router.push(url);
  };

  return (
    <>
      <div className="container relative -mt-8 z-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1">
            <div className="p-6 bg-white  rounded-xl shadow ">
              <div className="registration-form text-dark text-start">
                <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <label className="form-label font-medium text-slate-900 ">
                      {t("search")}
                    </label>
                    <div className="relative mt-2">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-[18px] absolute top-[10px] start-3 z-50"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 px-3 ps-10 h-10 bg-white  rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                        placeholder="Search packages..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label font-medium text-slate-900 ">
                      Price Range
                    </label>
                    <div className="relative mt-2">
                      <select 
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="form-select w-full py-2 px-3 ps-10 h-10 bg-white  rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                      >
                        <option value="">All Prices</option>
                        <option value="0-100">₾0 - ₾100</option>
                        <option value="100-500">₾100 - ₾500</option>
                        <option value="500-1000">₾500 - ₾1000</option>
                        <option value="1000-2000">₾1000 - ₾2000</option>
                        <option value="2000+">₾2000+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label font-medium text-slate-900 ">
                      Category
                    </label>
                    <div className="relative mt-2">
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select w-full py-2 px-3 ps-10 h-10 bg-white  rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                        disabled={loading}
                      >
                        <option value="">All Categories</option>
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="">
                    <button 
                      onClick={handleSearch}
                      className="explore-btn cursor-pointer group"
                    >
                      <span>Search Packages</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyFilter;
