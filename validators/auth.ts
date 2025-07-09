import { z } from "zod";
import { Role } from "@/types/auth";

export const authSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.nativeEnum(Role, {
    required_error: "Role harus dipilih",
    invalid_type_error: "Role tidak valid",
  }),
});
