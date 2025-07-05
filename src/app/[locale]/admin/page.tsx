/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { getAllPackages, deletePackage } from "@/lib/actions/packages";
import { getAllBuses, deleteBus } from "@/lib/actions/buses";
import { getAllBookings, deleteBooking } from "@/lib/actions/bookings";
import { getAllCategories } from "@/lib/actions/categories";
import { getAllLocations, deleteLocation } from "@/lib/actions/locations";
import PackageForm from "@/component/admin/PackageForm";
import BookingForm from "@/component/admin/BookingForm";
import BusForm from "@/component/admin/BusForm";
import CategoryForm from "@/component/admin/CategoryForm";
import LocationForm from "@/component/admin/LocationForm";
import { 
  Package, 
  Calendar, 
  Bus, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Tag,
  MapPin
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("packages");
  const [showForm, setShowForm] = useState<{ type: string; data?: any } | null>(null);
  const [data, setData] = useState({
    packages: [] as any[],
    bookings: [] as any[],
    buses: [] as any[],
    categories: [] as any[],
    locations: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalBuses: 0,
    totalRevenue: 0
  });

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [packagesRes, bookingsRes, busesRes, categoriesRes, locationsRes] = await Promise.all([
        getAllPackages(),
        getAllBookings(),
        getAllBuses(),
        getAllCategories(),
        getAllLocations()
      ]);

      const packages = packagesRes.success ? packagesRes.data || [] : [];
      const bookings = bookingsRes.success ? bookingsRes.data || [] : [];
      const buses = busesRes.success ? busesRes.data || [] : [];
      const categories = categoriesRes.success ? [...(categoriesRes.data || [])] : [];
      const locations = locationsRes.success ? locationsRes.data || [] : [];

      setData({ packages, bookings, buses, categories, locations });

      // Calculate stats
      const totalRevenue = bookings.reduce((sum: number, booking: any) => 
        sum + (booking.totalPrice || 0), 0);

      setStats({
        totalPackages: packages.length,
        totalBookings: bookings.length,
        totalBuses: buses.length,
        totalRevenue
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(null);
    loadData();
  };

  const handleDelete = async (type: string, id: number) => {
    if (confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      try {
        let result;
        
        switch (type) {
          case "packages":
            result = await deletePackage(id);
            break;
          case "bookings":
            result = await deleteBooking(id);
            break;
          case "buses":
            result = await deleteBus(id);
            break;
          case "categories":
            // Categories cannot be deleted as they are predefined enum values
            console.log("Categories cannot be deleted");
            return;
          case "locations":
            result = await deleteLocation(id);
            break;
          default:
            console.error("Unknown type:", type);
            return;
        }

        if (result.success) {
          console.log(`Successfully deleted ${type} with id:`, id);
          loadData(); // Reload data to reflect changes
        } else {
          console.error(`Failed to delete ${type}:`, result.error);
          alert(`Failed to delete ${type.slice(0, -1)}: ${result.error}`);
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type.slice(0, -1)}. Please try again.`);
      }
    }
  };

  const tabs = [
    { id: "packages", label: "Packages", icon: Package, color: "blue" },
    { id: "bookings", label: "Bookings", icon: Calendar, color: "green" },
    { id: "buses", label: "Buses", icon: Bus, color: "orange" },
    { id: "categories", label: "Categories", icon: Tag, color: "indigo" },
    { id: "locations", label: "Locations", icon: MapPin, color: "teal" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-20 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your travel business</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Bus className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Buses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white   rounded-xl shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? `border-${tab.color}-500 text-${tab.color}-600`
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div>
                <div className="flex mt-24 justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Travel Packages</h2>
                  <button
                    onClick={() => setShowForm({ type: "package" })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max People</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.packages.map((pkg: any) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                              <div className="text-sm text-gray-500">{pkg.description?.substring(0, 50)}...</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${pkg.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.maxPeople}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "package", data: pkg })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("packages", pkg.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
                  <button
                    onClick={() => setShowForm({ type: "booking" })}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Booking</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travelers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.bookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.package?.title || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{booking.adults + booking.children}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${booking.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "booking", data: booking })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("bookings", booking.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Buses Tab */}
            {activeTab === "buses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Buses</h2>
                  <button
                    onClick={() => setShowForm({ type: "bus" })}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Bus</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.buses.map((bus: any) => (
                        <tr key={bus.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{bus.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bus.seatCount} seats
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bus.package?.title || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "bus", data: bus })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("buses", bus.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                  <button
                    onClick={() => setShowForm({ type: "category" })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    <span>View Categories</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.categories.map((category: string) => (
                        <tr key={category} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.packages.filter((pkg: any) => pkg.category === category).length} packages
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === "locations" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
                  <button
                    onClick={() => setShowForm({ type: "location" })}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Location</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.locations.map((location: any) => (
                        <tr key={location.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{location.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {location.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {location.packages?.length || 0} packages
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "location", data: location })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("locations", location.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms */}
      {showForm && (
        <>
          {showForm.type === "package" && (
            <PackageForm
              package={showForm.data}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}
          {showForm.type === "booking" && (
            <BookingForm
              booking={showForm.data}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}
          {showForm.type === "bus" && (
            <BusForm
              bus={showForm.data}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}
          {showForm.type === "category" && (
            <CategoryForm
              onCancel={() => setShowForm(null)}
            />
          )}
          {showForm.type === "location" && (
            <LocationForm
              location={showForm.data}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}
        </>
      )}
    </div>
  );
} 