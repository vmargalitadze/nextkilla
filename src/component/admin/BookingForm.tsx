/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createBooking, updateBooking } from "@/lib/actions/bookings";
import { getAllPackages } from "@/lib/actions/packages";
import { X, Save, Loader2, Calendar, Users } from "lucide-react";

interface BookingFormProps {
  booking?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookingForm({ booking: bookingData, onSuccess, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    packageId: bookingData?.packageId || "",
    name: bookingData?.name || "",
    email: bookingData?.email || "",
    phone: bookingData?.phone || "",
    adults: bookingData?.adults || 1,
    children: bookingData?.children || 0,
    date: bookingData?.date ? new Date(bookingData.date).toISOString().split('T')[0] : "",
    totalPrice: bookingData?.totalPrice || "",
    seatNumber: bookingData?.seatNumber || "",
    seatSelected: bookingData?.seatSelected || false,
    seatId: bookingData?.seatId || "",
    discountId: bookingData?.discountId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    // Load packages for dropdown
    const loadPackages = async () => {
      try {
        const packagesRes = await getAllPackages();
        if (packagesRes.success && packagesRes.data) setPackages(packagesRes.data);
      } catch (err) {
        console.error("Error loading packages:", err);
      }
    };

    loadPackages();
  }, []);

  // Calculate total price when package or travelers change
  useEffect(() => {
    if (selectedPackage && formData.adults) {
      const adultPrice = selectedPackage.price * formData.adults;
      const childPrice = selectedPackage.price * 0.5 * formData.children;
      const total = adultPrice + childPrice;
      setFormData(prev => ({ ...prev, totalPrice: total }));
    }
  }, [selectedPackage, formData.adults, formData.children]);

  // Update selected package when packageId changes
  useEffect(() => {
    if (formData.packageId) {
      const pkg = packages.find((p: any) => p.id === Number(formData.packageId));
      setSelectedPackage(pkg);
    }
  }, [formData.packageId, packages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        packageId: Number(formData.packageId),
        adults: Number(formData.adults),
        children: Number(formData.children),
        totalPrice: Number(formData.totalPrice),
        seatId: formData.seatId ? Number(formData.seatId) : undefined,
        discountId: formData.discountId ? Number(formData.discountId) : undefined,
      };

      const result = bookingData?.id 
        ? await updateBooking({ ...submitData, id: bookingData.id })
        : await createBooking(submitData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || "Failed to save booking");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {bookingData?.id ? "Edit Booking" : "Create New Booking"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package *
            </label>
            <select
              value={formData.packageId}
              onChange={(e) => handleInputChange("packageId", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a package</option>
              {packages.map((pkg: any) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} - ${pkg.price} - {pkg.duration}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="customer@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-800">Travelers</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults *
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("adults", Math.max(1, formData.adults - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("adults", formData.adults + 1)}
                    className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("children", Math.max(0, formData.children - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.children}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("children", formData.children + 1)}
                    className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seat Number
              </label>
              <input
                type="text"
                value={formData.seatNumber}
                onChange={(e) => handleInputChange("seatNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 1A, 2B"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="seatSelected"
                checked={formData.seatSelected}
                onChange={(e) => handleInputChange("seatSelected", e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="seatSelected" className="ml-2 text-sm text-gray-700">
                Seat selection (+50 Lari)
              </label>
            </div>
          </div>

          {/* Price Summary */}
          {selectedPackage && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Adults ({formData.adults} × ${selectedPackage.price}):</span>
                  <span>${(selectedPackage.price * formData.adults).toFixed(2)}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({formData.children} × ${selectedPackage.price * 0.5}):</span>
                    <span>${(selectedPackage.price * 0.5 * formData.children).toFixed(2)}</span>
                  </div>
                )}
                {formData.seatSelected && (
                  <div className="flex justify-between">
                    <span>Seat Selection:</span>
                    <span>+50.00 Lari</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${formData.totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {bookingData?.id ? "Update Booking" : "Create Booking"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 