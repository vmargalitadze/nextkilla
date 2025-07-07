import { z } from "zod";

// Georgian phone number regex (supports various formats)
const georgianPhoneRegex = /^(\+995|995)?[5-9]\d{8}$/;

// Georgian ID number regex (11 digits)
const georgianIdRegex = /^\d{11}$/;

// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const bookingFormSchema = z.object({
  packageId: z
    .number()
    .min(1, "Please select a package")
    .positive("Package ID must be a positive number"),
  
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .trim(),
  
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(emailRegex, "Please enter a valid email address")
    .toLowerCase()
    .trim(),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || georgianPhoneRegex.test(val), {
      message: "Please enter a valid Georgian phone number (e.g., +995 5XX XXX XXX or 5XX XXX XXX)"
    })
    .transform((val) => val?.trim() || ""),
  
  idNumber: z
    .string()
    .min(11, "ID number must be exactly 11 digits")
    .max(11, "ID number must be exactly 11 digits")
    .regex(georgianIdRegex, "ID number must be exactly 11 digits")
    .trim(),
  
  date: z
    .string()
    .optional()
    .transform((val) => val || new Date().toISOString()),
  
  adults: z
    .number()
    .min(1, "At least 1 adult is required")
    .max(20, "Maximum 20 adults allowed")
    .int("Number of adults must be a whole number"),
  
  children: z
    .number()
    .min(0, "Number of children cannot be negative")
    .max(20, "Maximum 20 children allowed")
    .int("Number of children must be a whole number"),
  
  totalPrice: z
    .number()
    .min(0, "Total price cannot be negative")
    .positive("Total price must be positive"),
}).refine((data) => {
  // Custom validation: Total travelers cannot exceed package max people
  const totalTravelers = data.adults + data.children;
  return totalTravelers > 0;
}, {
  message: "At least one traveler is required",
  path: ["adults"]
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Validation error type
export type BookingFormErrors = {
  [K in keyof BookingFormData]?: string;
};

// Helper function to validate form data
export const validateBookingForm = (data: Partial<BookingFormData>) => {
  try {
    const validatedData = bookingFormSchema.parse(data);
    return { success: true, data: validatedData, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: BookingFormErrors = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof BookingFormData;
        errors[field] = err.message;
      });
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: "Validation failed" } };
  }
};

// Helper function to validate individual field
export const validateField = (field: keyof BookingFormData, value: unknown) => {
  try {
    // Validate the entire form data and extract the specific field error
    const testData = { [field]: value } as Partial<BookingFormData>;
    bookingFormSchema.parse(testData);
    return { isValid: true, error: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => err.path[0] === field);
      return { isValid: false, error: fieldError?.message || "Invalid field" };
    }
    return { isValid: false, error: "Invalid field" };
  }
}; 