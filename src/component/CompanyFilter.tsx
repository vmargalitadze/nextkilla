"use client";
import React, { useState } from "react";

function CompanyFilter() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [personCount, setPersonCount] = useState("");

  return (
    <>
      <div className="container relative -mt-8 z-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-700">
              <div className="registration-form text-dark text-start">
                <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <label className="form-label font-medium text-slate-900 dark:text-white">
                      Search:
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
                        className="w-full py-2 px-3 ps-10 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                        placeholder="Search destinations..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label font-medium text-slate-900 dark:text-white">
                      Departure Date:
                    </label>
                    <div className="relative mt-2">
                     
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full py-2 px-3 ps-10 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label font-medium text-slate-900 dark:text-white">
                      Return Date:
                    </label>
                    <div className="relative mt-2">
                     
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full py-2 px-3 ps-10 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label font-medium text-slate-900 dark:text-white">
                      No. of person:
                    </label>
                    <div className="relative mt-2">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-[18px] absolute top-[10px] start-3"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <select 
                        value={personCount}
                        onChange={(e) => setPersonCount(e.target.value)}
                        className="form-select w-full py-2 px-3 ps-10 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                      >
                        <option value="">Select persons</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>

                  <div className="">
                    <button className="explore-btn cursor-pointer group">
                      <span>Search</span>
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
