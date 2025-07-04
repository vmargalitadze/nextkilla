"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  logoUrl: z.string().url("Valid URL required").optional(),
});

const CompanyUpdateSchema = CompanySchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new company
export async function createCompany(data: z.infer<typeof CompanySchema>) {
  try {
    const validatedData = CompanySchema.parse(data);
    
    const company = await prisma.company.create({
      data: validatedData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: company };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create company" };
  }
}

// Update an existing company
export async function updateCompany(data: z.infer<typeof CompanyUpdateSchema>) {
  try {
    const validatedData = CompanyUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
      include: {
        packages: true,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: company };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update company" };
  }
}

// Delete a company
export async function deleteCompany(id: number) {
  try {
    await prisma.company.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete company" };
  }
}

// Get all companies
export async function getAllCompanies() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        packages: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: companies };
  } catch (error) {
    return { success: false, error: "Failed to fetch companies" };
  }
}

// Get a single company by ID
export async function getCompanyById(id: number) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        packages: true,
      },
    });

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    return { success: true, data: company };
  } catch (error) {
    return { success: false, error: "Failed to fetch company" };
  }
} 