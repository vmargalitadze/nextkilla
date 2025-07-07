/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { getAllPackages } from "@/lib/actions/packages";
import { 
  type BookingFormData, 
  type BookingFormErrors,
  validateBookingForm,
  validateField 
} from "@/lib/validation/booking";

interface Package {
  id: number;
  title: string;
  price: number;
  maxPeople: number;
  byBus: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: string;
  gallery?: Array<{ url: string }>;
  dates?: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    maxPeople: number;
  }>;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("bookingForm");
  const locale = params.locale as string;
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Form data
  const [formData, setFormData] = useState<BookingFormData>({
    packageId: 0,
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    adults: 1,
    totalPrice: 0
  });

  // Validation errors
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof BookingFormData, boolean>>({
    packageId: false,
    name: false,
    email: false,
    phone: false,
    idNumber: false,
    adults: false,
    totalPrice: false
  });

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ startDate: Date; endDate: Date } | null>(null);

  // Load packages on component mount
  const loadPackages = useCallback(async () => {
    try {
      setError("");
      const packagesResult = await getAllPackages();
      
      if (packagesResult.success) {
        const packagesData = packagesResult.data || [];
        setPackages(packagesData);
      } else {
        setError("Failed to load packages");
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      setError("Failed to load packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Check for booking data from sessionStorage
  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData && packages.length > 0) {
      try {
        const data = JSON.parse(bookingData);
        setFormData(prev => ({
          ...prev,
          packageId: data.packageId,
          adults: data.adults,
          totalPrice: data.totalPrice
        }));

        const package_ = packages.find(pkg => pkg.id === data.packageId);
        if (package_) {
          setSelectedPackage(package_);
        }

        sessionStorage.removeItem('bookingData');
      } catch (error) {
        console.error("Error parsing booking data:", error);
      }
    }
  }, [packages]);

  // Update selected package when packageId changes
  useEffect(() => {
    if (formData.packageId) {
      const package_ = packages.find(pkg => pkg.id === formData.packageId);
      setSelectedPackage(package_ || null);
      // Reset selected date when package changes
      setSelectedDate(null);
    }
  }, [formData.packageId, packages]);

  // Calculate total price when package or adults changes
  const totalPrice = useMemo(() => {
    if (selectedPackage) {
      return selectedPackage.price * formData.adults;
    }
    return 0;
  }, [selectedPackage, formData.adults]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalPrice
    }));
  }, [totalPrice]);

  // Real-time field validation
  const validateFieldOnChange = useCallback((field: keyof BookingFormData, value: string | number | undefined) => {
    if (touched[field]) {
      const validation = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: validation.isValid ? undefined : validation.error
      }));
    }
  }, [touched]);

  const handleInputChange = useCallback((field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateFieldOnChange(field, value);
  }, [validateFieldOnChange]);

  const handleBlur = useCallback((field: keyof BookingFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateFieldOnChange(field, formData[field]);
  }, [validateFieldOnChange, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      packageId: true,
      name: true,
      email: true,
      phone: true,
      idNumber: true,
      adults: true,
      totalPrice: true
    });

    // Validate entire form
    const validation = validateBookingForm(formData);
    
    if (!validation.success) {
      setErrors(validation.errors as BookingFormErrors);
      return;
    }

    if (!selectedPackage) {
      setErrors({ packageId: t("pleaseSelectPackage") });
      return;
    }

    // For bus tours, require date selection
    if (selectedPackage.byBus && !selectedDate) {
      setErrors({ packageId: t("pleaseSelectDate") });
      return;
    }

    // Check if total travelers exceed max people
    const totalTravelers = formData.adults;
    let maxPeople = selectedPackage.maxPeople;
    
    // For bus tours, check against the selected date's maxPeople
    if (selectedPackage.byBus && selectedDate) {
      const selectedDateData = selectedPackage.dates?.find((date) => 
        date.startDate.getTime() === selectedDate.startDate.getTime() && 
        date.endDate.getTime() === selectedDate.endDate.getTime()
      );
      if (selectedDateData) {
        maxPeople = selectedDateData.maxPeople;
      }
    }
    
    if (totalTravelers > maxPeople) {
      setErrors({ 
        adults: t("totalTravelersExceed", { total: totalTravelers, max: maxPeople }) 
      });
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const bookingData = {
        packageId: formData.packageId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        idNumber: formData.idNumber,
        adults: formData.adults,
        totalPrice: formData.totalPrice,
        startDate: selectedPackage.byBus && selectedDate ? selectedDate.startDate : selectedPackage.startDate || new Date(),
        endDate: selectedPackage.byBus && selectedDate ? selectedDate.endDate : selectedPackage.endDate || new Date()
      };

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        const redirectPath = `/${locale}${result.redirectUrl}`;
        router.push(redirectPath);
      } else {
        setError(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("An error occurred while creating your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = useCallback((field: keyof BookingFormData) => {
    return touched[field] && errors[field] ? errors[field] : "";
  }, [touched, errors]);

  const getFieldClassName = useCallback((field: keyof BookingFormData) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
    const hasError = getFieldError(field);
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    return `${baseClasses} border-gray-300 hover:border-gray-400`;
  }, [getFieldError]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString(locale === 'ge' ? 'ka-GE' : 'en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }, [locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error && !selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Packages</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadPackages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Package Selection */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              {t("selectPackage")}
            </h2>
            <div>
              <select
                value={formData.packageId}
                onChange={(e) => handleInputChange("packageId", Number(e.target.value))}
                onBlur={() => handleBlur("packageId")}
                className={getFieldClassName("packageId")}
                required
                aria-describedby={getFieldError("packageId") ? "package-error" : undefined}
              >
                <option value="">{t("choosePackage")}</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - ₾{pkg.price} ({pkg.startDate && pkg.endDate ? 
                      `${formatDate(pkg.startDate)} - ${formatDate(pkg.endDate)}` : 
                      pkg.duration
                    })
                  </option>
                ))}
              </select>
              {getFieldError("packageId") && (
                <p id="package-error" className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {getFieldError("packageId")}
                </p>
              )}
            </div>

            {selectedPackage && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-6">
                  {selectedPackage.gallery && selectedPackage.gallery.length > 0 && (
                    <div className="relative">
                      <Image
                        src={selectedPackage.gallery[0].url}
                        alt={selectedPackage.title}
                        className="object-cover rounded-lg shadow-md"
                        width={120}
                        height={120}
                        priority
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedPackage.title}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">₾{selectedPackage.price}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>👥 Max: {selectedPackage.maxPeople} people</span>
                      {selectedPackage.byBus && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">🚌 Bus Tour</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Selection for Bus Tours */}
          {selectedPackage && selectedPackage.byBus && selectedPackage.dates && selectedPackage.dates.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📅</span>
                {t("selectDate")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPackage.dates.map((date) => (
                  <button
                    key={date.id}
                    type="button"
                    onClick={() => setSelectedDate({ startDate: date.startDate, endDate: date.endDate })}
                    className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                      selectedDate && 
                      selectedDate.startDate.getTime() === date.startDate.getTime() && 
                      selectedDate.endDate.getTime() === date.endDate.getTime()
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-300 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {formatDate(date.startDate)}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      to {formatDate(date.endDate)}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      👥 Max: {date.maxPeople} people
                    </div>
                  </button>
                ))}
              </div>
              {!selectedDate && (
                <p className="text-red-500 text-sm mt-3 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {t("pleaseSelectDate")}
                </p>
              )}
            </div>
          )}

          {/* Traveler Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👤</span>
              {t("travelerInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={getFieldClassName("name")}
                  placeholder={t("fullNamePlaceholder")}
                  required
                  aria-describedby={getFieldError("name") ? "name-error" : undefined}
                />
                {getFieldError("name") && (
                  <p id="name-error" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("emailAddress")} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={getFieldClassName("email")}
                  placeholder={t("emailPlaceholder")}
                  required
                  aria-describedby={getFieldError("email") ? "email-error" : undefined}
                />
                {getFieldError("email") && (
                  <p id="email-error" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("phoneNumber")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={getFieldClassName("phone")}
                  placeholder={t("phonePlaceholder")}
                  aria-describedby={getFieldError("phone") ? "phone-error" : undefined}
                />
                {getFieldError("phone") && (
                  <p id="phone-error" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getFieldError("phone")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("personalIdNumber")} *
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  onBlur={() => handleBlur("idNumber")}
                  className={getFieldClassName("idNumber")}
                  placeholder={t("idNumberPlaceholder")}
                  maxLength={11}
                  required
                  aria-describedby={getFieldError("idNumber") ? "id-error" : "id-help"}
                />
                <p id="id-help" className="text-xs text-gray-500 mt-1">{t("idNumberHelp")}</p>
                {getFieldError("idNumber") && (
                  <p id="id-error" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getFieldError("idNumber")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎒</span>
              {t("travelDetails")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("numberOfAdults")} *
                </label>
                <input
                  type="number"
                  value={formData.adults}
                  onChange={(e) => handleInputChange("adults", Number(e.target.value))}
                  onBlur={() => handleBlur("adults")}
                  className={getFieldClassName("adults")}
                  min="1"
                  max="20"
                  required
                  aria-describedby={getFieldError("adults") ? "adults-error" : undefined}
                />
                {getFieldError("adults") && (
                  <p id="adults-error" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {getFieldError("adults")}
                  </p>
                )}
              </div>

              {selectedPackage && (
                <div className="flex items-end">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("totalTravelers")}
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <span className="text-lg font-semibold text-blue-700">
                        {formData.adults} / {selectedPackage.maxPeople}
                      </span>
                    </div>
                    {formData.adults > selectedPackage.maxPeople && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {t("exceedsCapacity")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Summary */}
          {selectedPackage && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">💰</span>
                {t("priceSummary")}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{t("adultsPrice", { count: formData.adults, price: selectedPackage.price })}</span>
                  <span className="font-semibold">₾{(selectedPackage.price * formData.adults).toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{t("totalPrice")}</span>
                  <span className="text-2xl font-bold text-blue-600">₾{formData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting || !selectedPackage}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t("submitting")}
                </span>
              ) : (
                t("submitBooking")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 