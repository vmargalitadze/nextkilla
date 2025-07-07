"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createBooking } from "@/lib/actions/bookings";
import { getAllPackages } from "@/lib/actions/packages";
import { 
  type BookingFormData, 
  type BookingFormErrors,
  validateBookingForm,
  validateField 
} from "@/lib/validation/booking";
import Image from "next/image";

interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  duration: string;
  maxPeople: number;
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
  }>;
}

export default function BookingPage() {
  const router = useRouter();
  const t = useTranslations("bookingForm");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState<BookingFormData>({
    packageId: 0,
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    date: "",
    adults: 2,
    children: 0,
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
    date: false,
    adults: false,
    children: false,
    totalPrice: false
  });

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packagesResult = await getAllPackages();
        
        if (packagesResult.success) {
          const packagesData = packagesResult.data || [];
          console.log("Loaded packages:", packagesData);
          setPackages(packagesData);
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  useEffect(() => {
    // Check for booking data from sessionStorage (from product page)
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      try {
        const data = JSON.parse(bookingData);
        setFormData(prev => ({
          ...prev,
          packageId: data.packageId,
          adults: data.adults,
          children: data.children,
          totalPrice: data.totalPrice
        }));

        // Find the selected package
        const package_ = packages.find(pkg => pkg.id === data.packageId);
        if (package_) {
          setSelectedPackage(package_);
        }

        // Clear sessionStorage
        sessionStorage.removeItem('bookingData');
      } catch (error) {
        console.error("Error parsing booking data:", error);
      }
    }
  }, [packages]);

  useEffect(() => {
    // Update selected package when packageId changes
    if (formData.packageId) {
      const package_ = packages.find(pkg => pkg.id === formData.packageId);
      setSelectedPackage(package_ || null);
    }
  }, [formData.packageId, packages]);

  // Calculate total price when package, adults, or children changes
  useEffect(() => {
    if (selectedPackage) {
      const basePrice = (selectedPackage.price * formData.adults) + 
                       (selectedPackage.price * 0.5 * formData.children);
      const totalPrice = basePrice;
      
      setFormData(prev => ({
        ...prev,
        totalPrice
      }));
    }
  }, [selectedPackage, formData.adults, formData.children]);

  // Real-time field validation
  const validateFieldOnChange = (field: keyof BookingFormData, value: string | number) => {
    if (touched[field]) {
      const validation = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: validation.isValid ? undefined : validation.error
      }));
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateFieldOnChange(field, value);
  };

  const handleBlur = (field: keyof BookingFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateFieldOnChange(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      packageId: true,
      name: true,
      email: true,
      phone: true,
      idNumber: true,
      date: true,
      adults: true,
      children: true,
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

    // Check if total travelers exceed package max people
    const totalTravelers = formData.adults + formData.children;
    if (totalTravelers > selectedPackage.maxPeople) {
      setErrors({ 
        adults: t("totalTravelersExceed", { total: totalTravelers, max: selectedPackage.maxPeople }) 
      });
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        packageId: formData.packageId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        idNumber: formData.idNumber,
        date: formData.date || new Date().toISOString(),
        adults: formData.adults,
        children: formData.children,
        totalPrice: formData.totalPrice
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        // Store booking data in sessionStorage for confirmation page
        sessionStorage.setItem('confirmationData', JSON.stringify(result.data));
        router.push('/confirmation');
      } else {
        alert(`Error creating booking: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("An error occurred while creating your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: keyof BookingFormData) => {
    return touched[field] && errors[field] ? errors[field] : "";
  };

  const getFieldClassName = (field: keyof BookingFormData) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const hasError = getFieldError(field);
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    return `${baseClasses} border-gray-300`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Package Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("selectPackage")}</h2>
            <div>
              <select
                value={formData.packageId}
                onChange={(e) => handleInputChange("packageId", Number(e.target.value))}
                onBlur={() => handleBlur("packageId")}
                className={getFieldClassName("packageId")}
                required
              >
                <option value="">{t("choosePackage")}</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - ₾{pkg.price} ({pkg.duration})
                  </option>
                ))}
              </select>
              {getFieldError("packageId") && (
                <p className="text-red-500 text-sm mt-1">{getFieldError("packageId")}</p>
              )}
            </div>

            {selectedPackage && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  {selectedPackage.gallery && selectedPackage.gallery.length > 0 && (
                    <Image
                      src={selectedPackage.gallery[0].url}
                      alt={selectedPackage.title}
                      className=" object-cover rounded-lg"
                      width={80}
                      height={80}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{selectedPackage.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedPackage.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📍 {selectedPackage.location.name}, {selectedPackage.location.country}</span>
                      <span>⏱️ {selectedPackage.duration}</span>
                      <span>👥 Max {selectedPackage.maxPeople} people</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">₾{selectedPackage.price}</div>
                    {selectedPackage.salePrice && (
                      <div className="text-sm text-green-600">Sale: ₾{selectedPackage.salePrice}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Traveler Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("travelerInfo")}</h2>
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
                />
                {getFieldError("name") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("name")}</p>
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
                />
                {getFieldError("email") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
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
                />
                {getFieldError("phone") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("phone")}</p>
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
                />
                <p className="text-xs text-gray-500 mt-1">{t("idNumberHelp")}</p>
                {getFieldError("idNumber") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("idNumber")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("travelDetails")}</h2>
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
                />
                {getFieldError("adults") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("adults")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("numberOfChildren")}
                </label>
                <input
                  type="number"
                  value={formData.children}
                  onChange={(e) => handleInputChange("children", Number(e.target.value))}
                  onBlur={() => handleBlur("children")}
                  className={getFieldClassName("children")}
                  min="0"
                  max="20"
                />
                <p className="text-xs text-gray-500 mt-1">{t("childrenDiscount")}</p>
                {getFieldError("children") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("children")}</p>
                )}
              </div>

              {selectedPackage && (
                <div className="flex items-end">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("totalTravelers")}
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-lg font-semibold">
                        {formData.adults + formData.children} / {selectedPackage.maxPeople}
                      </span>
                    </div>
                    {formData.adults + formData.children > selectedPackage.maxPeople && (
                      <p className="text-red-500 text-sm mt-1">
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
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t("priceSummary")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t("adultsPrice", { count: formData.adults, price: selectedPackage.price })}</span>
                  <span>₾{(selectedPackage.price * formData.adults).toFixed(2)}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>{t("childrenPrice", { count: formData.children, price: selectedPackage.price * 0.5 })}</span>
                    <span>₾{(selectedPackage.price * 0.5 * formData.children).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>{t("totalPrice")}</span>
                  <span>₾{formData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting || !selectedPackage}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors disabled:cursor-not-allowed"
            >
              {submitting ? t("submitting") : t("submitBooking")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 