"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const SeatSchema = z.object({
  number: z.string().min(1, "Seat number is required"),
  busId: z.number().positive("Bus is required"),
});

const SeatUpdateSchema = SeatSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new seat
export async function createSeat(data: z.infer<typeof SeatSchema>) {
  try {
    const validatedData = SeatSchema.parse(data);
    
    const seat = await prisma.seat.create({
      data: validatedData,
      include: {
        bus: true,
        booking: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: seat };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create seat" };
  }
}

// Update an existing seat
export async function updateSeat(data: z.infer<typeof SeatUpdateSchema>) {
  try {
    const validatedData = SeatUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const seat = await prisma.seat.update({
      where: { id },
      data: updateData,
      include: {
        bus: true,
        booking: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: seat };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update seat" };
  }
}

// Delete a seat
export async function deleteSeat(id: number) {
  try {
    await prisma.seat.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete seat" };
  }
}

// Get all seats
export async function getAllSeats() {
  try {
    const seats = await prisma.seat.findMany({
      include: {
        bus: true,
        booking: true,
      },
      orderBy: [
        { busId: "asc" },
        { number: "asc" },
      ],
    });

    return { success: true, data: seats };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch seats" };
  }
}

// Get seats by bus ID
export async function getSeatsByBusId(busId: number) {
  try {
    const seats = await prisma.seat.findMany({
      where: { busId },
      include: {
        bus: true,
        booking: true,
      },
      orderBy: { number: "asc" },
    });

    return { success: true, data: seats };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch seats" };
  }
}

// Get a single seat by ID
export async function getSeatById(id: number) {
  try {
    const seat = await prisma.seat.findUnique({
      where: { id },
      include: {
        bus: true,
        booking: true,
      },
    });

    if (!seat) {
      return { success: false, error: "Seat not found" };
    }

    return { success: true, data: seat };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch seat" };
  }
} 