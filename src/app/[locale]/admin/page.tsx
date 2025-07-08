/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { getAllPackages, deletePackage } from "@/lib/actions/packages";
import { getAllBookings, deleteBooking } from "@/lib/actions/bookings";
import { getAllCategories } from "@/lib/actions/categories";
import { getAllLocations, deleteLocation } from "@/lib/actions/locations";
import PackageForm from "@/component/admin/PackageForm";
import CategoryForm from "@/component/admin/CategoryForm";

import LocationForm from "@/component/admin/LocationForm";
import GalleryImageForm from "@/component/admin/GalleryImageForm";
import DiscountForm from "@/component/admin/DiscountForm";
import PackageDateForm from "@/component/admin/PackageDateForm";
import { 
  Package, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Tag,
  MapPin,
  Image,
  Percent
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("packages");
  const [showForm, setShowForm] = useState<{ type: string; data?: any } | null>(null);
  const [showDateForm, setShowDateForm] = useState<number | null>(null);
  const [data, setData] = useState({
    packages: [] as any[],
    bookings: [] as any[],
    categories: [] as any[],
    locations: [] as any[],
    galleryImages: [] as any[],
    discounts: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  
  // Get locale from URL
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
  
  // Georgian month names
  const georgianMonths = {
    'Jan': 'იან',
    'Feb': 'თებ',
    'Mar': 'მარ',
    'Apr': 'აპრ',
    'May': 'მაი',
    'Jun': 'ივნ',
    'Jul': 'ივლ',
    'Aug': 'აგვ',
    'Sep': 'სექ',
    'Oct': 'ოქტ',
    'Nov': 'ნოე',
    'Dec': 'დეკ'
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (locale === 'ge') {
      const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const parts = formatted.split(' ');
      const month = georgianMonths[parts[0] as keyof typeof georgianMonths] || parts[0];
      return `${month} ${parts[1]}, ${parts[2]}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [packagesRes, bookingsRes, categoriesRes, locationsRes, discountsRes] = await Promise.all([
        getAllPackages(),
        getAllBookings(),
        getAllCategories(),
        getAllLocations(),
        fetch('/api/discounts').then(res => res.json())
      ]);

      const packages = packagesRes.success ? packagesRes.data || [] : [];
      const bookings = bookingsRes.success ? bookingsRes.data || [] : [];
      const categories = categoriesRes.success ? [...(categoriesRes.data || [])] : [];
      const locations = locationsRes.success ? locationsRes.data || [] : [];
      const discounts = discountsRes.success ? discountsRes.data || [] : [];

      setData({ packages, bookings, categories, locations, galleryImages: [], discounts });

      // Calculate stats
      const totalRevenue = bookings.reduce((sum: number, booking: any) => 
        sum + (booking.totalPrice || 0), 0);

      setStats({
        totalPackages: packages.length,
        totalBookings: bookings.length,
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
    { id: "categories", label: "Categories", icon: Tag, color: "indigo" },
    { id: "locations", label: "Locations", icon: MapPin, color: "teal" },
    { id: "gallery", label: "Gallery Images", icon: Image, color: "purple" },
    { id: "discounts", label: "Discounts", icon: Percent, color: "pink" }
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
                  ₾{stats.totalRevenue.toLocaleString()}
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
                <div className="flex  justify-between items-center mb-6">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max People</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
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
                            ₾{pkg.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.salePrice ? (
                              <span className="text-green-600 font-medium">₾{pkg.salePrice}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.byBus ? (
                              pkg.dates && pkg.dates.length > 0 ? (
                                <div>
                                  {pkg.dates.map((date: any, index: number) => (
                                    <div key={index} className="mb-1">
                                      <div>{formatDate(date.startDate)} - {formatDate(date.endDate)}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">No dates set</span>
                              )
                            ) : pkg.startDate && pkg.endDate ? (
                              `${formatDate(pkg.startDate)} - ${formatDate(pkg.endDate)}`
                            ) : (
                              `${pkg.duration} days`
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.byBus ? (
                              pkg.dates && pkg.dates.length > 0 ? (
                                <div>
                                  <div>{pkg.dates[0].maxPeople}</div>
                               
                                </div>
                              ) : (
                                <span className="text-gray-400">No dates set</span>
                              )
                            ) : (
                              pkg.maxPeople
                            )}
                          </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.byBus ? (
                              pkg.dates && pkg.dates.length > 0 ? (
                                <div>
                                  <div>{pkg.dates.map((date: any, index: number) => {
                                    const bookingsForThisDate = pkg.bookings?.filter((booking: any) => 
                                      booking.startDate && booking.endDate &&
                                      new Date(date.startDate).toDateString() === new Date(booking.startDate).toDateString()
                                    ) || [];
                                    const totalBookedForDate = bookingsForThisDate.reduce((sum: number, booking: any) => sum + booking.adults, 0);
                                    return (
                                      <div key={index} className="mb-1">
                                        <span className="text-xs text-gray-500">{formatDate(date.startDate)}: </span>
                                        <span>{totalBookedForDate} ჯავშანი</span>
                                      </div>
                                    );
                                  })}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )
                            ) : (
                              pkg.bookings?.reduce((sum: number, booking: any) => sum + booking.adults, 0) || 0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.byBus ? (
                              pkg.dates && pkg.dates.length > 0 ? (
                                <div>
                                  <div>{pkg.dates.map((date: any, index: number) => {
                                    const bookingsForThisDate = pkg.bookings?.filter((booking: any) => 
                                      booking.startDate && booking.endDate &&
                                      new Date(date.startDate).toDateString() === new Date(booking.startDate).toDateString()
                                    ) || [];
                                    const totalBookedForDate = bookingsForThisDate.reduce((sum: number, booking: any) => sum + booking.adults, 0);
                                    const availableForDate = date.maxPeople - totalBookedForDate;
                                    return (
                                      <div key={index} className="mb-1">
                                        <span className="text-xs text-gray-500">{formatDate(date.startDate)}: </span>
                                        <span className={availableForDate <= 0 ? "text-red-600 font-medium" : ""}>
                                          {availableForDate} დარჩა
                                        </span>
                                      </div>
                                    );
                                  })}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )
                            ) : (
                              (pkg.maxPeople - (pkg.bookings?.reduce((sum: number, booking: any) => sum + booking.adults, 0) || 0))
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "package", data: pkg })}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Package"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {pkg.byBus && (
                                <button
                                  onClick={() => setShowDateForm(pkg.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Manage Dates"
                                >
                                  <Calendar className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete("packages", pkg.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Package"
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
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travelers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
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
                            {booking.idNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.package?.title || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.startDate && booking.endDate ? (
                              <div>
                                <div>{formatDate(booking.startDate)}</div>
                                <div className="text-gray-500">to {formatDate(booking.endDate)}</div>
                              </div>
                            ) : (
                              formatDate(booking.date || '')
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{booking.adults}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₾{booking.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.phone || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
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
                            {location.city}
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

            {/* Gallery Images Tab */}
            {activeTab === "gallery" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gallery Images</h2>
                  <button
                    onClick={() => setShowForm({ type: "gallery" })}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery Images</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.packages.map((pkg: any) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                              <div className="text-sm text-gray-500">{pkg.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.gallery?.length || 0} images
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "gallery", data: pkg })}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                <Edit className="w-4 h-4" />
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

            {/* Discounts Tab */}
            {activeTab === "discounts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Discounts</h2>
                  <button
                    onClick={() => setShowForm({ type: "discount" })}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Discount</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.discounts.map((discount: any) => (
                        <tr key={discount.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{discount.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${discount.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(discount.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              new Date(discount.expiresAt) > new Date() 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {new Date(discount.expiresAt) > new Date() ? 'Active' : 'Expired'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowForm({ type: "discount", data: discount })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("discounts", discount.id)}
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
          {showForm.type === "gallery" && (
            <GalleryImageForm
              packageId={showForm.data?.id}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}
          {showForm.type === "discount" && (
            <DiscountForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(null)}
            />
          )}

        </>
      )}

      {/* Package Date Form */}
      {showDateForm && (
        <PackageDateForm
          packageId={showDateForm}
          onSuccess={handleFormSuccess}
          onClose={() => setShowDateForm(null)}
        />
      )}
    </div>
  );
} 