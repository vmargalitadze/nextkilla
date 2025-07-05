import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
import { getAllPackages } from "@/lib/actions/packages";

async function Dest() {
  const packagesResult = await getAllPackages();
  const packages = packagesResult.success ? packagesResult.data || [] : [];

  return (
    <>
      <div className="pt-20 z-10">
        <div className="max-w-[1690px] px-3 mx-auto">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mb-12">
            {packages.map((package_, index) => (
              <div
                key={package_.id}
                className="destination-card group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationName: "fadeInUp",
                  animationDuration: "0.6s",
                  animationFillMode: "both",
                }}
              >
                <div className="overflow-hidden">
                  <div className="relative w-full h-[300px]">
                    <Image
                      src="/category/photo-1532254497630-c74966e79621.jpg"
                      alt={package_.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-white text-gray-800 text-center py-5 px-4">
                  <h5 className="lg:text-xl text-lg font-bold leading-tight group-hover:text-red-400 transition-colors duration-300">
                    <Link href={`/product/${package_.id}`} className="">
                      {package_.title}
                    </Link>
                  </h5>
                  <p className="font-medium text-base mt-2 leading-relaxed text-gray-600">
                    {package_.duration} • ${package_.price}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {package_.location?.name} • {package_.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Centered Explore Now Button */}
          <div className="flex justify-center items-center mt-8">
            <Link
              href="/all"
              className="explore-btn flex items-center gap-3 group max-w-xs"
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
      </div>
    </>
  );
}

export default Dest;
