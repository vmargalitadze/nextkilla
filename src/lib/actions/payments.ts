"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Zod schemas for validation
const PaymentSchema = z.object({
  bookingId: z.number().positive("Booking ID is required"),
  amount: z.number().positive("Amount must be positive"),
  status: z.enum(["pending", "paid", "failed", "cancelled"]),
});

const PaymentUpdateSchema = PaymentSchema.partial().extend({
  id: z.number().positive("ID is required"),
});

// Create a new payment
export async function createPayment(data: z.infer<typeof PaymentSchema>) {
  try {
    const validatedData = PaymentSchema.parse(data);
    
    const payment = await prisma.payment.create({
      data: validatedData,
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    revalidatePath("/admin");
    return { success: true, data: payment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create payment" };
  }
}

// Update payment status (legacy function for backward compatibility)
export async function updatePaymentStatus(id: number, status: string) {
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    revalidatePath("/admin");
    return { success: true, data: payment };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to update payment status" };
  }
}

// Update payment using PaymentUpdateSchema
export async function updatePayment(data: z.infer<typeof PaymentUpdateSchema>) {
  try {
    const validatedData = PaymentUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    revalidatePath("/admin");
    return { success: true, data: payment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating payment:", error);
    return { success: false, error: "Failed to update payment" };
  }
}

// Get all payments
export async function getAllPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: payments };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch payments" };
  }
}

// Get payment by ID
export async function getPaymentById(id: number) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Payment not found" };
    }

    return { success: true, data: payment };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch payment" };
  }
}

// Get payment by booking ID
export async function getPaymentByBookingId(bookingId: number) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    return { success: true, data: payment };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to fetch payment" };
  }
} 