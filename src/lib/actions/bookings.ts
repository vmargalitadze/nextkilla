
"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const BookingSchema = z.object({
  packageId: z.number().positive("Package is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  adults: z.number().positive("At least 1 adult required"),
  children: z.number().min(0, "Children cannot be negative"),
  date: z.string().min(1, "Date is required"),
  totalPrice: z.number().positive("Total price must be positive"),
  seatNumber: z.string().optional(),
  seatSelected: z.boolean().default(false),
  seatId: z.number().optional(),
  discountId: z.number().optional(),
});

const BookingUpdateSchema = BookingSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new booking
export async function createBooking(data: z.infer<typeof BookingSchema>) {
  try {
    const validatedData = BookingSchema.parse(data);
    
    const booking = await prisma.booking.create({
      data: validatedData,
      include: {
        package: true,
        seat: true,
        payment: true,
        discount: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: booking };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create booking" };
  }
}

// Update an existing booking
export async function updateBooking(data: z.infer<typeof BookingUpdateSchema>) {
  try {
    const validatedData = BookingUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        package: true,
        seat: true,
        payment: true,
        discount: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: booking };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update booking" };
  }
}

// Delete a booking
export async function deleteBooking(id: number) {
  try {
    await prisma.booking.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete booking" };
  }
}

// Get all bookings
export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        package: true,
        seat: true,
        payment: true,
        discount: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}

// Get a single booking by ID
export async function getBookingById(id: number) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
        seat: true,
        payment: true,
        discount: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return { success: true, data: booking };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch booking" };
  }
} 