import { z } from "zod";

export const LoginFormValidation = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username must be at most 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be at most 50 characters"),
});

export const PatientFormValidation = z.object({
  identificationNumber: z.string().min(1, "identification number must not be empty"),
  identificationType: z.enum(["healthCardNumber", "provincialID", "passport", "drivingLicense"]),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  dateOfBirth: z.coerce.date().refine(date => date <= new Date(), "Date of birth cannot be in the future"),
  biologicalSex: z.enum(["Male", "Female", "Other"]),
  preferredPronouns: z.string().optional(),
  phoneNumber: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  emergencyContact: z.string().optional(),
});
