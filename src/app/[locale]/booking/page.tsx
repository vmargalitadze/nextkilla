/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";

import { getAllPackages } from "@/lib/actions/packages";
import { createBooking } from "@/lib/actions/bookings";
import { getAllBuses } from "@/lib/actions/buses";
import { useRouter } from "@/i18n/navigation";
import { Users, Calendar, MapPin, Package, Loader2, Save } from "lucide-react";
import Image from "next/image";

interface Package {
  id: number;
  title: string;
  price: number;
  duration: string;
  maxPeople: number;
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
  bus?: {
    id: number;
    name: string;
    seatCount: number;
  } | null;
}

export default function BookingPage() {
  
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    packageId: 0,
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    date: "",
    adults: 2,
    children: 0,
    seatNumber: "",
    seatSelected: false,
    totalPrice: 0
  });

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const [packagesResult, busesResult] = await Promise.all([
          getAllPackages(),
          getAllBuses()
        ]);
        
        if (packagesResult.success) {
          const packagesData = packagesResult.data || [];
          console.log("Loaded packages:", packagesData);
          console.log("Package bus data:", packagesData.map(pkg => ({ 
            id: pkg.id, 
            title: pkg.title, 
            bus: pkg.bus,
            maxPeople: pkg.maxPeople 
          })));
          setPackages(packagesData);
        }
        
        if (busesResult.success) {
          const busesData = busesResult.data || [];
          console.log("Loaded buses:", busesData);
          setBuses(busesData);
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
  // Calculate seat count - use bus seatCount if available, otherwise use maxPeople
  const getBusForPackage = (packageId: number) => {
    return buses.find(bus => bus.packageId === packageId);
  };
  
  const packageBus = selectedPackage ? getBusForPackage(selectedPackage.id) : null;
  const totalSeats = selectedPackage?.bus?.seatCount || packageBus?.seatCount || selectedPackage?.maxPeople || 40;

  const seatCols = 4;
  const selectedSeat = formData.seatNumber;
  
  // Debug logging
  console.log("Selected package:", selectedPackage);
  console.log("Package bus (from relation):", selectedPackage?.bus);
  console.log("Package bus (from buses array):", packageBus);
  console.log("Total seats:", totalSeats);
  console.log("Max people:", selectedPackage?.maxPeople);
  console.log("All buses:", buses);
  
  // Validate that total travelers don't exceed package maxPeople
  const totalTravelers = formData.adults + formData.children;
  const canAddMoreTravelers = !selectedPackage || totalTravelers < selectedPackage.maxPeople;
  useEffect(() => {
    // Calculate total price when package, adults, children, or seat selection changes
    if (selectedPackage) {
      const basePrice = selectedPackage.price * formData.adults + selectedPackage.price * 0.5 * formData.children;
      const seatFee = formData.seatSelected ? 50 : 0;
      const totalPrice = basePrice + seatFee;
      setFormData(prev => ({ ...prev, totalPrice }));
    }
  }, [selectedPackage, formData.adults, formData.children, formData.seatSelected]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (formData.seatNumber === seatNumber) {
      // If clicking the same seat, deselect it
      setFormData(prev => ({ 
        ...prev, 
        seatNumber: "",
        seatSelected: false 
      }));
    } else {
      // Select new seat and automatically enable seat selection fee
      setFormData(prev => ({ 
        ...prev, 
        seatNumber: seatNumber,
        seatSelected: true 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage) {
      alert("Please select a package");
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
        date: new Date().toISOString(),
        adults: formData.adults,
        children: formData.children,
        seatNumber: formData.seatNumber,
        seatSelected: formData.seatSelected,
        totalPrice: formData.totalPrice
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        // Store booking data for confirmation page
        sessionStorage.setItem('confirmationData', JSON.stringify(result.data));
        // Redirect to confirmation page
        router.push('/confirmation');
      } else {
        alert(`Error creating booking: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error creating booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-400 to-red-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Book Your Trip</h1>
            <p className="mt-2 text-red-100">Complete your booking details below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Package Selection */}
            <div className="bg-gray-50 rounded-lg p-6">
             
              
              {!selectedPackage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Selected Package:</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage(null);
                      handleInputChange("packageId", 0);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Change Package
                  </button>
                </div>
              )}

              {/* Selected Package Info */}
              {selectedPackage && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedPackage.gallery[0]?.url || "/category/photo-1532254497630-c74966e79621.jpg"}
                        alt={selectedPackage.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{selectedPackage.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{selectedPackage.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedPackage.location?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>₾{selectedPackage.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-medium text-gray-800">Customer Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+995 555 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal ID Number (პირადობის ნომერი) *
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="11 digits (e.g., 12345678901)"
                    required
                    maxLength={11}
                    pattern="[0-9]{11}"
                  />
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-red-600" />
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
                      disabled={!canAddMoreTravelers}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  {selectedPackage && (
                    <p className="text-xs text-gray-500 mt-1">
                      Max capacity: {selectedPackage.maxPeople} people
                    </p>
                  )}
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
                      disabled={!canAddMoreTravelers}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  {!canAddMoreTravelers && selectedPackage && (
                    <p className="text-xs text-red-500 mt-1">
                      Maximum capacity reached ({selectedPackage.maxPeople} people)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            {selectedPackage ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 text-red-600">🪑</div>
                  <h3 className="text-lg font-medium text-gray-800">Select Your Seat</h3>
                </div>
                
                <div className="bg-white rounded-lg p-6 border">
                  {/* Bus Layout */}
                  <div className="mb-4">
                    <div className="text-center mb-4">
                      <div className="inline-block bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium">
                        🚌 {selectedPackage.bus?.name || packageBus?.name || 'Bus Layout'} ({totalSeats} seats)
                      </div>
                      {selectedPackage.bus ? (
                        <p className="text-xs text-gray-500 mt-1">
                          Bus: {selectedPackage.bus.name} • {selectedPackage.bus.seatCount} seats
                        </p>
                      ) : packageBus ? (
                        <p className="text-xs text-gray-500 mt-1">
                          Bus: {packageBus.name} • {packageBus.seatCount} seats
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Using package capacity: {selectedPackage.maxPeople} people
                        </p>
                      )}
                    </div>
                    
                    {/* Driver Area */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-300 rounded-lg px-4 py-2 text-xs font-medium">
                        🚗 Driver
                      </div>
                    </div>
                    
                    {/* Seats Grid */}
                    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                      {Array.from({ length: totalSeats }, (_, i) => {
                        const row = Math.floor(i / seatCols) + 1;
                        const col = String.fromCharCode(65 + (i % seatCols));
                        const seatNumber = `${row}${col}`;
                        const isSelected = selectedSeat === seatNumber;
                        
                        // Add aisle between columns 2 and 3
                        const isAisle = i % seatCols === 1;
                        
                        return (
                          <React.Fragment key={seatNumber}>
                            <button
                              type="button"
                              onClick={() => handleSeatSelection(seatNumber)}
                              className={`h-8 w-full rounded-md text-xs font-medium transition-all duration-200 ${
                                isSelected 
                                  ? "bg-red-500 text-white shadow-lg scale-105" 
                                  : "bg-gray-100 hover:bg-red-100 hover:scale-105"
                              }`}
                            >
                              {seatNumber}
                            </button>
                            {isAisle && <div className="h-8 flex items-center justify-center text-xs text-gray-400">|</div>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center mt-4 space-x-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-100 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Selected (+₾50)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Seat Info */}
                {selectedSeat && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-green-600">✅</div>
                      <span className="text-sm font-medium text-green-800">
                        Selected Seat: <span className="font-bold">{selectedSeat}</span>
                      </span>
                      <span className="text-xs text-gray-500 ml-2">(+₾50.00)</span>
                    </div>
                  </div>
                )}
                
                {/* Instructions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-blue-600">💡</div>
                    <span className="text-sm text-blue-800">
                      Click a seat to select it (+₾50.00). Click again to deselect.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">🪑</div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Seat Selection</h3>
                  <p className="text-gray-600">Please select a package above to choose your seat</p>
                </div>
              </div>
            )}

            {/* Price Summary */}
            {selectedPackage && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Price Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Adults ({formData.adults} × ₾{selectedPackage.price}):</span>
                    <span>₾{(selectedPackage.price * formData.adults).toFixed(2)}</span>
                  </div>
                  {formData.children > 0 && (
                    <div className="flex justify-between">
                      <span>Children ({formData.children} × ₾{selectedPackage.price * 0.5}):</span>
                      <span>₾{(selectedPackage.price * 0.5 * formData.children).toFixed(2)}</span>
                    </div>
                  )}
                  {formData.seatSelected && (
                    <div className="flex justify-between">
                      <span>Seat Selection ({selectedSeat}):</span>
                      <span>+₾50.00</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₾{formData.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedPackage}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Booking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 