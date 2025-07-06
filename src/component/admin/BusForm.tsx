/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createBus, updateBus } from "@/lib/actions/buses";
import { getAllPackages } from "@/lib/actions/packages";
import { X, Save, Loader2, Bus } from "lucide-react";

interface BusFormProps {
  bus?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BusForm({ bus: busData, onSuccess, onCancel }: BusFormProps) {
  const [formData, setFormData] = useState({
    name: busData?.name || "",
    seatCount: busData?.seatCount || "",
    packageId: busData?.packageId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    // Load packages for dropdown
    const loadPackages = async () => {
      try {
        const packagesRes = await getAllPackages();
        if (packagesRes.success && packagesRes.data) setPackages(packagesRes.data);
      } catch {
        console.error("Error loading packages");
      }
    };

    loadPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        seatCount: Number(formData.seatCount),
        packageId: Number(formData.packageId),
      };

      const result = busData?.id
        ? await updateBus({ ...submitData, id: busData.id })
        : await createBus(submitData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || "Failed to save bus");
      }
    } catch (err) {
      console.log(err);

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
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bus className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {busData?.id ? "Edit Bus" : "Create New Bus"}
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

          {/* Bus Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Bus A1, Express Bus"
              required
            />
          </div>

          {/* Seat Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Seats *
            </label>
            <input
              type="number"
              value={formData.seatCount}
              onChange={(e) => handleInputChange("seatCount", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 50"
              min="1"
              max="100"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum 100 seats per bus
            </p>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associated Package *
            </label>
            <select
              value={formData.packageId}
              onChange={(e) => handleInputChange("packageId", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a package</option>
              {packages.map((pkg: any) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} - ${pkg.price}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              This bus will be used for the selected package
            </p>
          </div>

          {/* Bus Preview */}
          {formData.seatCount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Bus Layout Preview</h3>
              <div className="space-y-2">
                {Array.from({ length: Math.ceil(Math.min(Number(formData.seatCount), 50) / 4) }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    {/* Left side: 2 seats */}
                    {Array.from({ length: 2 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * 4 + seatIndex + 1;
                      if (seatNumber > formData.seatCount) return null;
                      return (
                        <div
                          key={seatNumber}
                          className="w-8 h-8 bg-green-200 border border-green-400 rounded flex items-center justify-center text-xs text-green-800"
                        >
                          {seatNumber}
                        </div>
                      );
                    })}

                    {/* Aisle */}
                    <div className="w-6" />

                    {/* Right side: 2 seats */}
                    {Array.from({ length: 2 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * 4 + seatIndex + 3;
                      if (seatNumber > formData.seatCount) return null;
                      return (
                        <div
                          key={seatNumber}
                          className="w-8 h-8 bg-green-200 border border-green-400 rounded flex items-center justify-center text-xs text-green-800"
                        >
                          {seatNumber}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {Number(formData.seatCount) > 50 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing first 50 seats. Total: {formData.seatCount} seats
                </p>
              )}
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
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {busData?.id ? "Update Bus" : "Create Bus"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 