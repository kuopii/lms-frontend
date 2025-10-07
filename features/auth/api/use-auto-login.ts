import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAutoLogin = () => {
  const router = useRouter();

  const performAutoLogin = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Welcome to Koupii!");
        router.push("/dashboard/profile");
        return true;
      } else {
        toast.error(result?.error || "Login failed");
        router.push("/auth/sign-in");
        return false;
      }
    } catch {
      toast.error("Registration successful. Please login manually.");
      router.push("/auth/sign-in");
      return false;
    }
  };

  return { performAutoLogin };
};
