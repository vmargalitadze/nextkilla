"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

const CategoryUpdateSchema = CategorySchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new category
export async function createCategory(data: z.infer<typeof CategorySchema>) {
  try {
    const validatedData = CategorySchema.parse(data);
    
    const category = await prisma.category.create({
      data: validatedData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: category };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create category" };
  }
}

// Update an existing category
export async function updateCategory(data: z.infer<typeof CategoryUpdateSchema>) {
  try {
    const validatedData = CategoryUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: category };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update category" };
  }
}

// Delete a category
export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete category" };
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        packages: true,
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Get a single category by ID
export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        packages: true,
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch category" };
  }
} 