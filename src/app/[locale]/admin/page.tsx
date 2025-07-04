/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

const initialPackages = [
  { id: 1, title: "Machu Picchu", price: 175, maxPeople: 10 },
  { id: 2, title: "Great Wall", price: 140, maxPeople: 20 },
];
const initialBookings = [
  { id: 1, name: "John Doe", packageId: 1, seat: "1A", date: "2024-07-10" },
  { id: 2, name: "Jane Smith", packageId: 2, seat: "2B", date: "2024-07-12" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("packages");
  const [packages, setPackages] = useState(initialPackages);
  const [bookings, setBookings] = useState(initialBookings);
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);
  const [form, setForm] = useState<any>({});

  // Handlers for CRUD
  const openModal = (type: string, data?: any) => {
    setForm(data || {});
    setModal({ type, data });
  };
  const closeModal = () => setModal(null);

  // Package CRUD
  const savePackage = () => {
    if (form.id) {
      setPackages((pkgs) => pkgs.map((p) => (p.id === form.id ? form : p)));
    } else {
      setPackages((pkgs) => [...pkgs, { ...form, id: Date.now() }]);
    }
    closeModal();
  };
  const deletePackage = (id: number) => {
    setPackages((pkgs) => pkgs.filter((p) => p.id !== id));
  };

  // Booking CRUD
  const saveBooking = () => {
    if (form.id) {
      setBookings((bks) => bks.map((b) => (b.id === form.id ? form : b)));
    } else {
      setBookings((bks) => [...bks, { ...form, id: Date.now() }]);
    }
    closeModal();
  };
  const deleteBooking = (id: number) => {
    setBookings((bks) => bks.filter((b) => b.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${tab === "packages" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("packages")}
        >
          Packages
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "bookings" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("bookings")}
        >
          Bookings
        </button>
      </div>

      {/* Packages Tab */}
      {tab === "packages" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Packages</h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => openModal("package")}
            >
              + Add Package
            </button>
          </div>
          <table className="w-full border mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Price</th>
                <th className="p-2">Max People</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-t">
                  <td className="p-2">{pkg.id}</td>
                  <td className="p-2">{pkg.title}</td>
                  <td className="p-2">${pkg.price}</td>
                  <td className="p-2">{pkg.maxPeople}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded"
                      onClick={() => openModal("package", pkg)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => deletePackage(pkg.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bookings</h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => openModal("booking")}
            >
              + Add Booking
            </button>
          </div>
          <table className="w-full border mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Package</th>
                <th className="p-2">Seat</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.packageId}</td>
                  <td className="p-2">{b.seat}</td>
                  <td className="p-2">{b.date}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded"
                      onClick={() => openModal("booking", b)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => deleteBooking(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 min-w-[300px] max-w-[90vw]">
            <h3 className="text-lg font-bold mb-4">
              {modal.type === "package"
                ? form.id
                  ? "Edit Package"
                  : "Add Package"
                : form.id
                ? "Edit Booking"
                : "Add Booking"}
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                modal.type === "package" ? savePackage() : saveBooking();
              }}
              className="space-y-4"
            >
              {modal.type === "package" ? (
                <>
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Title"
                    value={form.title || ""}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Price"
                    type="number"
                    value={form.price || ""}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Max People"
                    type="number"
                    value={form.maxPeople || ""}
                    onChange={e => setForm({ ...form, maxPeople: Number(e.target.value) })}
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Name"
                    value={form.name || ""}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Package ID"
                    type="number"
                    value={form.packageId || ""}
                    onChange={e => setForm({ ...form, packageId: Number(e.target.value) })}
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Seat"
                    value={form.seat || ""}
                    onChange={e => setForm({ ...form, seat: e.target.value })}
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Date"
                    type="date"
                    value={form.date || ""}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 