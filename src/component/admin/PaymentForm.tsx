/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { updatePayment, getPaymentById } from "@/lib/actions/payments";
import { Save, Loader2, X } from "lucide-react";

interface PaymentFormProps {
  paymentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({ paymentId, onSuccess, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    id: paymentId || 0,
    bookingId: 0,
    amount: "",
    status: "pending" as "pending" | "paid" | "failed" | "cancelled",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);

  // Load payment data if editing
  useEffect(() => {
    if (paymentId) {
      const loadPayment = async () => {
        setInitialLoading(true);
        try {
          const result = await getPaymentById(paymentId);
          if (result.success && result.data) {
            const payment = result.data;
            setFormData({
              id: payment.id,
              bookingId: payment.bookingId,
              amount: payment.amount.toString(),
              status: payment.status as "pending" | "paid" | "failed" | "cancelled",
            });
          } else {
            setError(result.error || "Failed to load payment");
          }
        } catch (error) {
          console.error("Error loading payment:", error);
          setError("Failed to load payment");
        } finally {
          setInitialLoading(false);
        }
      };

      loadPayment();
    }
  }, [paymentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = {
        id: formData.id,
        ...(formData.amount && { amount: parseFloat(formData.amount) }),
        ...(formData.status && { status: formData.status }),
      };

      const result = await updatePayment(updateData);

      if (result.success) {
        console.log("Payment updated successfully");
        onSuccess?.();
      } else {
        setError(result.error || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      setError("Failed to update payment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading payment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {paymentId ? "Update Payment" : "Create Payment"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₾)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Payment
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