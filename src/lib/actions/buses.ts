"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const BusSchema = z.object({
  name: z.string().min(1, "Bus name is required"),
  seatCount: z.number().positive("Seat count must be positive"),
  packageId: z.number().positive("Package is required"),
});

const BusUpdateSchema = BusSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new bus
export async function createBus(data: z.infer<typeof BusSchema>) {
  try {
    const validatedData = BusSchema.parse(data);
    
    const bus = await prisma.bus.create({
      data: validatedData,
      include: {
        seats: true,
        package: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: bus };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create bus" };
  }
}

// Update an existing bus
export async function updateBus(data: z.infer<typeof BusUpdateSchema>) {
  try {
    const validatedData = BusUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const bus = await prisma.bus.update({
      where: { id },
      data: updateData,
      include: {
        seats: true,
        package: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: bus };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update bus" };
  }
}

// Delete a bus
export async function deleteBus(id: number) {
  try {
    await prisma.bus.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete bus" };
  }
}

// Get all buses
export async function getAllBuses() {
  try {
    const buses = await prisma.bus.findMany({
      include: {
        seats: true,
        package: true,
      },
      orderBy: { id: "asc" },
    });

    return { success: true, data: buses };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch buses" };
  }
}

// Get a single bus by ID
export async function getBusById(id: number) {
  try {
    const bus = await prisma.bus.findUnique({
      where: { id },
      include: {
        seats: true,
        package: true,
      },
    });

    if (!bus) {
      return { success: false, error: "Bus not found" };
    }

    return { success: true, data: bus };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch bus" };
  }
} 