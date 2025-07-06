"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "@/i18n/navigation";
import { CheckCircle, Calendar, MapPin, Package, Users, CreditCard, Download, Home } from "lucide-react";
import Image from "next/image";

interface BookingData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  idNumber: string;
  adults: number;
  children: number;
  totalPrice: number;
  seatNumber?: string;
  seatSelected: boolean;
  package: {
    id: number;
    title: string;
    price: number;
    duration: string;
    gallery?: Array<{
      id: number;
      url: string;
      packageId: number;
    }>;
    location?: {
      id: number;
      name: string;
      country: string;
    };
  };
  payment: {
    id: number;
    status: string;
    amount: number;
  };
  createdAt: string;
}

export default function ConfirmationPage() {
 
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('confirmationData');
    if (storedBookingData) {
      try {
        const data = JSON.parse(storedBookingData);
        console.log("Confirmation page received data:", data);
        console.log("Total price from booking:", data.totalPrice);
        console.log("Seat selected:", data.seatSelected);
        console.log("Seat number:", data.seatNumber);
        console.log("Adults:", data.adults);
        console.log("Children:", data.children);
        console.log("Package price:", data.package?.price);
        setBookingData(data);
        // Clear sessionStorage
        sessionStorage.removeItem('confirmationData');
      } catch (error) {
        console.error("Error parsing booking data:", error);
        // Only redirect on parsing error
        router.push('/');
      }
    } else {
      // If no booking data, just show the "no data" state instead of redirecting
      console.log("No booking data found in sessionStorage");
    }
    setLoading(false);
  }, [router]);

  const handleDownloadReceipt = () => {
    if (!bookingData) return;
    
    // Create a simple receipt text
    const receipt = `
BOOKING CONFIRMATION
====================

Booking ID: ${bookingData.id}
Date: ${new Date(bookingData.createdAt).toLocaleDateString()}

CUSTOMER INFORMATION
-------------------
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone || 'N/A'}
ID Number: ${bookingData.idNumber}

PACKAGE DETAILS
---------------
Package: ${bookingData.package.title}
Duration: ${bookingData.package.duration}
Location: ${bookingData.package.location?.name || 'N/A'}

TRAVELERS
---------
Adults: ${bookingData.adults}
Children: ${bookingData.children}
Total: ${bookingData.adults + bookingData.children}

SEAT INFORMATION
----------------
${bookingData.seatSelected ? `Selected Seat: ${bookingData.seatNumber}` : 'No seat selected'}

PAYMENT
-------
Total Amount: ₾${bookingData.totalPrice}
Payment Status: ${bookingData.payment.status.toUpperCase()}

Thank you for your booking!
    `;

    // Create and download file
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${bookingData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-400 to-gray-600 px-6 py-8 text-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">No Booking Found</h1>
                  <p className="text-gray-100">No booking data available for confirmation</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-6">
                It looks like you dont have any recent booking to confirm, or the booking data has expired.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </button>
                <button
                  onClick={() => router.push('/booking')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Book a Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                <p className="text-green-100">Your trip has been successfully booked</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Booking ID: #{bookingData.id}</p>
              <p className="text-green-100">{new Date(bookingData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Package Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-800">Package Details</h3>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  {bookingData.package.gallery && bookingData.package.gallery.length > 0 ? (
                    <Image
                      src={bookingData.package.gallery[0].url}
                      alt={bookingData.package.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">{bookingData.package.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{bookingData.package.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{bookingData.package.location?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>₾{bookingData.package.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="font-medium">{bookingData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{bookingData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">{bookingData.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">ID Number:</span>
                    <p className="font-medium">{bookingData.idNumber}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Travel Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Travelers:</span>
                    <span className="font-medium">{bookingData.adults + bookingData.children} ({bookingData.adults} adults, {bookingData.children} children)</span>
                  </div>
                  {bookingData.seatSelected && (
                    <div>
                      <span className="text-sm text-gray-600">Selected Seat:</span>
                      <p className="font-medium">{bookingData.seatNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Booking Date:</span>
                    <p className="font-medium">{new Date(bookingData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-800">Payment Information</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Adults ({bookingData.adults} × ₾{bookingData.package.price}):</span>
                  <span>₾{(bookingData.package.price * bookingData.adults).toFixed(2)}</span>
                </div>
                {bookingData.children > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Children ({bookingData.children} × ₾{bookingData.package.price * 0.5}):</span>
                    <span>₾{(bookingData.package.price * 0.5 * bookingData.children).toFixed(2)}</span>
                  </div>
                )}
                {bookingData.seatSelected && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Seat Selection ({bookingData.seatNumber}):</span>
                    <span>+₾50.00</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₾{bookingData.totalPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bookingData.payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : bookingData.payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bookingData.payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t">
              <button
                onClick={handleDownloadReceipt}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 