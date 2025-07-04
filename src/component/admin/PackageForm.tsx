/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createPackage, updatePackage } from "@/lib/actions/packages";
import { getAllCategories } from "@/lib/actions/categories";
import { getAllLocations } from "@/lib/actions/locations";
import { getAllBuses } from "@/lib/actions/buses";

import ImageUpload from "../CloudinaryUploader";
import { X,  Save, Loader2 } from "lucide-react";

interface PackageFormProps {
  package?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PackageForm({ package: packageData, onSuccess, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    title: packageData?.title || "",
    description: packageData?.description || "",
    price: packageData?.price || "",
    duration: packageData?.duration || "",
    maxPeople: packageData?.maxPeople || "",
    categoryId: packageData?.categoryId || "",
    locationId: packageData?.locationId || "",
    busId: packageData?.busId || "",
    gallery: packageData?.gallery?.map((img: any) => img.url) || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    // Load dropdown data
    const loadData = async () => {
      try {
        const [categoriesRes, locationsRes, busesRes] = await Promise.all([
          getAllCategories(),
          getAllLocations(),
          getAllBuses(),
        ]);

        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);
        if (locationsRes.success && locationsRes.data) setLocations(locationsRes.data);
        if (busesRes.success && busesRes.data) setBuses(busesRes.data);
      } catch {
        console.error("Error loading form data");
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        maxPeople: Number(formData.maxPeople),
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
        busId: formData.busId ? Number(formData.busId) : undefined,
      };

      const result = packageData?.id 
        ? await updatePackage({ ...submitData, id: packageData.id })
        : await createPackage(submitData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || "Failed to save package");
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
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {packageData?.id ? "Edit Package" : "Create New Package"}
          </h2>
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter package title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 4 Days / 5 Nights"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max People *
              </label>
              <input
                type="number"
                value={formData.maxPeople}
                onChange={(e) => handleInputChange("maxPeople", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
                min="1"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter package description..."
              required
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => handleInputChange("locationId", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a location</option>
                {locations.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.city}, {location.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus (Optional)
              </label>
              <select
                value={formData.busId}
                onChange={(e) => handleInputChange("busId", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a bus (optional)</option>
                {buses.map((bus: any) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images
            </label>
            <ImageUpload
              value={formData.gallery}
              onChange={(urls) => handleInputChange("gallery", urls)}
            />
          </div>

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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {packageData?.id ? "Update Package" : "Create Package"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 