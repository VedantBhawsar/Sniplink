import z from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(18),
  confirmPassword: z.string().min(8).max(18).optional(),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(18),
});
