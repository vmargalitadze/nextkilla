"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const LocationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  country: z.string().min(1, "Country is required"),
});

const LocationUpdateSchema = LocationSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new location
export async function createLocation(data: z.infer<typeof LocationSchema>) {
  try {
    const validatedData = LocationSchema.parse(data);
    
    const location = await prisma.location.create({
      data: validatedData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: location };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create location" };
  }
}

// Update an existing location
export async function updateLocation(data: z.infer<typeof LocationUpdateSchema>) {
  try {
    const validatedData = LocationUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const location = await prisma.location.update({
      where: { id },
      data: updateData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: location };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update location" };
  }
}

// Delete a location
export async function deleteLocation(id: number) {
  try {
    await prisma.location.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete location" };
  }
}

// Get all locations
export async function getAllLocations() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        packages: true,
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: locations };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch locations" };
  }
}

// Get a single location by ID
export async function getLocationById(id: number) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        packages: true,
      },
    });

    if (!location) {
      return { success: false, error: "Location not found" };
    }

    return { success: true, data: location };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch location" };
  }
} 