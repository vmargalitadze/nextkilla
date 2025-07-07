
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const BookingSchema = z.object({
  packageId: z.number().positive("Package is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  idNumber: z.string().min(11, "Personal ID number must be 11 digits").max(11, "Personal ID number must be 11 digits"),
  date: z.string().optional().default(() => new Date().toISOString()),
  adults: z.number().positive("At least 1 adult required"),
  children: z.number().min(0, "Children cannot be negative"),
  totalPrice: z.number().positive("Total price must be positive"),
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
        package: {
          include: {
            gallery: true,
            location: true,
          },
        },
        discount: true,
      },
    });

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
        package: {
          include: {
            gallery: true,
            location: true,
          },
        },
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
    console.error("Error deleting booking:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        return { success: false, error: "Booking not found" };
      }
      if (error.message.includes("Foreign key constraint")) {
        return { success: false, error: "Cannot delete booking due to related data" };
      }
    }
    
    return { success: false, error: "Failed to delete booking" };
  }
}

// Get all bookings
export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        package: {
          include: {
            gallery: true,
            location: true,
          },
        },
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
        package: {
          include: {
            gallery: true,
            location: true,
          },
        },
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