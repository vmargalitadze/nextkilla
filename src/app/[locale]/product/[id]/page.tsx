"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin, Calendar, Users, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PackageDetails() {
  const t = useTranslations("packageDetails");
  const [activeTab, setActiveTab] = useState("overview");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const packageData = {
    title: "Cusco & Salkantay Trekking to Machu Picchu",
    price: 175,
    rating: 4.8,
    reviews: 20,
    duration: "4 Days / 5 Night",
    maxPeople: 10,
    location: "North Transylvania",
    description:
      "Lorem omnes impedit ius, vel et hinc agam fabulas. Ut audiam invenire iracundia vim. Tn eam dimo diam ea. Piber Korem sit amet.",
    longDescription:
      "Al elit omnes impedit ius, vel et hinc agam fabulas. Ut audiam invenire iracundia vim. En eam dico similique, ut sint posse sit, eum sumo diam ea. Liber consectetuer in mei, sea in imperdiet assueverit contentiones, an his cibo blandit tacimates. Iusto iudicabit similique id velex, in sea rebum deseruisse appellantur. Lorem ipsum Alienum phaedrum torquatos nec eu, vis detraxit pericu in mei, vix aperiri vix at,dolor sit amet.",
    includes: [
      "3 Nights Accommodation",
      "Airport Transfers",
      "2 Meals / day",
      "Box Lunch, Dinner & Snacks",
      "On Trip Transport",
    ],
    excludes: [
      "Departure Taxes",
      "Airport Transfers",
      "Entry Fees",
      "Box Lunch, Dinner & Snacks",
    ],
    tourPlan: [
      {
        day: "01",
        title: t("welcomeTo") + " Edinburgh",
        description:
          "Qui ad idque soluta deterruisset, nec sale pertinax mandamus et. Eu mei soluta scriptorem dissentiet, sensibus cotidieque. Ne per malorum vivendum principes, congue imperdiet cu vel. Sit cu stet autem eligendi, eros reprimique mel id, no pri tation altera. At soluta fierent laboramus eum.",
      },
      {
        day: "02",
        title: t("adventureBegins"),
        description:
          "Qui ad idque soluta deterruisset, nec sale pertinax mandamus et. Eu mei soluta scriptorem dissentiet, sensibus cotidieque. Ne per malorum vivendum principes.",
        features: [
          t("professionalTourGuide"),
          t("transportationCost"),
          t("transportationCost"),
        ],
      },
      {
        day: "03",
        title: t("historicalTour"),
        description:
          "Qui ad idque soluta deterruisset, nec sale pertinax mandamus et. Eu mei soluta scriptorem dissentiet, sensibus cotidieque. Ne per malorum vivendum principes.",
        features: [
          "3 " + t("nightsAccommodation"),
          "2 " + t("mealsPerDay"),
          t("breakfast"),
        ],
      },
      {
        day: "04",
        title: t("return"),
        description:
          "Qui ad idque soluta deterruisset, nec sale pertinax mandamus et. Eu mei soluta scriptorem dissentiet, sensibus cotidieque. Ne per malorum vivendum principes, congue imperdiet cu vel. Sit cu stet autem eligendi, eros reprimique mel id, no pri tation altera. At soluta fierent laboramus eum.",
      },
    ],
    gallery: [
      "/category/photo-1532254497630-c74966e79621.jpg",
      "/category/photo-1532254497630-c74966e79621.jpg",
      "/category/photo-1532254497630-c74966e79621.jpg",
      "/category/photo-1532254497630-c74966e79621.jpg",
      "/category/photo-1532254497630-c74966e79621.jpg",
      "/category/photo-1532254497630-c74966e79621.jpg",
    ],
    relatedPackages: [
      {
        title: "The Great Wall, Chaina",
        price: 140,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
      },
      {
        title: "Longest Sea Beach, Cox's Bazar",
        price: 140,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
      },
      {
        title: "Long Trail Mountain, Napal",
        price: 140,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
      },
    ],
  };

  const totalPrice =
    packageData.price * adults + packageData.price * 0.5 * children;

  return (
    <>
      <div className="w-full lg:py-36 py-20 relative overflow-hidden">
        <div className="jarallax absolute inset-0 z-minus" data-jarallax="">
          <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <div className="absolute w-full  inset-0 -z-10">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] lg:h-[700px]">
                <Image
                  src="/breadcrumb-bg.webp"
                  alt="placeholder"
                  fill
                  className="object-cover pointer-events-none"
                  priority
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>
          </div>
        </div>
        <Image
          src="/bird-illustration-w.png"
          alt="placeholder"
          width={100}
          height={100}
          className="absolute top-[10%] right-[4%] z-1 w-[7.5%]"
        />
      </div>

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-96">
                    <Image
                      src="/category/photo-1532254497630-c74966e79621.jpg"
                      alt={packageData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-gray-800">
                        {packageData.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(packageData.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({packageData.reviews} {t("reviews")})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-400" />
                        <span className="text-gray-600">
                          {packageData.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-400" />
                        <span className="text-gray-600">
                          {t("maxPeople")}: {packageData.maxPeople}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <span className="text-gray-600">
                          {packageData.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">
                      {packageData.description}
                    </p>
                    <p className="text-gray-600">
                      {packageData.longDescription}
                    </p>
                  </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg shadow-lg mt-8">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {[
                        { id: "overview", label: t("overview") },
                        { id: "tour-plan", label: t("tourPlan") },
                        { id: "gallery", label: t("gallery") },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? "border-red-400 text-red-400"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === "overview" && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            {t("priceIncludes")}
                          </h3>
                          <ul className="space-y-2">
                            {packageData.includes.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            {t("priceExcludes")}
                          </h3>
                          <ul className="space-y-2">
                            {packageData.excludes.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <X className="w-4 h-4 text-red-500" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "tour-plan" && (
                      <div className="space-y-6">
                        {packageData.tourPlan.map((day, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-400 text-white rounded-full flex items-center justify-center font-bold">
                              {day.day}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold mb-2">
                                {t("day")} {day.day} : {day.title}
                              </h4>
                              <p className="text-gray-600 mb-3">
                                {day.description}
                              </p>
                              {day.features && (
                                <ul className="space-y-1">
                                  {day.features.map((feature, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                      <span className="text-gray-600">
                                        {feature}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "gallery" && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {packageData.gallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-48 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Price Card */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        ${packageData.price}
                      </h3>
                      <p className="text-gray-600">{t("perPerson")}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("date")}
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("numberOfTravelers")}
                        </label>
                        <div className="text-sm text-gray-600 mb-2">
                          {adults} {t("adults")} - {children} {t("children")}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t("adult")}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setAdults(Math.max(1, adults - 1))
                                }
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{adults}</span>
                              <button
                                onClick={() => setAdults(adults + 1)}
                                className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              {t("childrenLabel")}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setChildren(Math.max(0, children - 1))
                                }
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">
                                {children}
                              </span>
                              <button
                                onClick={() => setChildren(children + 1)}
                                className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span>{t("addServicePerBooking")}</span>
                        <span>+$30</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("addServicePerDay")}</span>
                        <span>+$10</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>{t("total")}:</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors">
                        {t("bookNow")}
                      </button>
                    </div>
                  </div>

                  {/* Related Packages */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {t("offerPackages")}
                    </h3>
                    <div className="space-y-4">
                      {packageData.relatedPackages.map((pkg, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={pkg.image}
                              alt={pkg.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{pkg.title}</h4>
                            <p className="text-red-400 font-semibold">
                              {t("from")} ${pkg.price}.00
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
