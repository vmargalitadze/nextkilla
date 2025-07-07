"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Predefined categories
 const CATEGORIES = [
  "Cultural",
  "Adventure", 
  "Historical",
  "Culinary",
  "Beach",
  "Ski",
  "Eco",
  "Religious",
  "Shopping",
  "Wellness",
  "Photography",
  "Weekend",
  "International",
  "Domestic"
] as const;

// Zod schemas for validation
const PackageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxPeople: z.number().positive("Max people must be positive"),
  popular: z.boolean().default(false),
  byBus: z.boolean().default(false),
  byPlane: z.boolean().default(false),
  category: z.enum(CATEGORIES),
  locationId: z.number().positive("Location is required"),
});

const PackageUpdateSchema = PackageSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new package with validation
export async function createPackage(data: z.infer<typeof PackageSchema>) {
  try {
    // Validate the data with custom refinement
    const validatedData = PackageSchema.refine((data) => {
      // Duration is required for non-bus tours
      if (!data.byBus && (!data.duration || data.duration.trim() === "")) {
        return false;
      }
      return true;
    }, {
      message: "Duration is required for non-bus tours",
      path: ["duration"]
    }).parse(data);
    
    const package_ = await prisma.package.create({
      data: {
        ...validatedData,
        duration: validatedData.duration || "", // Ensure duration is always a string
      },
      include: {
        location: true,
        tourPlan: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: package_ };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create package" };
  }
}

// Update an existing package
export async function updatePackage(data: z.infer<typeof PackageUpdateSchema>) {
  try {
    const validatedData = PackageUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    // Apply the same duration validation for updates
    if (updateData.byBus !== undefined || updateData.duration !== undefined) {
      const validationSchema = PackageSchema.refine((data) => {
        // Duration is required for non-bus tours
        if (!data.byBus && (!data.duration || data.duration.trim() === "")) {
          return false;
        }
        return true;
      }, {
        message: "Duration is required for non-bus tours",
        path: ["duration"]
      });
      
      // Validate the update data
      validationSchema.parse(updateData);
    }

    const package_ = await prisma.package.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        tourPlan: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: package_ };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update package" };
  }
}

// Delete a package
export async function deletePackage(id: number) {
  try {
    await prisma.package.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete package" };
  }
}

// Get all packages
export async function getAllPackages() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        location: true,
        bookings: true,
        tourPlan: true,
        gallery: true,
        dates: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: packages };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch packages" };
  }
}

// Get a single package by ID
export async function getPackageById(id: number) {
  try {
    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        location: true,
        bookings: true,
        gallery: true,
        tourPlan: true,
        includedItems: true,
        notIncludedItems: true,
        dates: true,
      } as Parameters<typeof prisma.package.findUnique>[0]['include'],
    });

    if (!package_) {
      return { success: false, error: "Package not found" };
    }

    return { success: true, data: package_ };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch package" };
  }
}

// Get popular packages
