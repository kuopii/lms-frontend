import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Development-only bypass: if DEV_TEST_EMAIL/DEV_TEST_PASSWORD are set
        // and we are not in production, accept those credentials and return a
        // mock user so developers can log in locally without a backend.
        if (process.env.NODE_ENV !== "production") {
          const devEmail = process.env.DEV_TEST_EMAIL;
          const devPassword = process.env.DEV_TEST_PASSWORD;
          const devRole = process.env.DEV_TEST_ROLE;
          const devName = process.env.DEV_TEST_NAME;

          if (devEmail && devPassword) {
            if (
              credentials.email === devEmail &&
              credentials.password === devPassword
            ) {
              const validRole: "student" | "teacher" | "admin" =
                devRole === "student" ||
                devRole === "teacher" ||
                devRole === "admin"
                  ? (devRole as "student" | "teacher" | "admin")
                  : "student";

              const email: string = String(devEmail);
              const name: string = String(devName || "Dev User");

              return {
                id: "dev-user",
                email,
                name,
                accessToken: "dev-token",
                role: validRole,
                avatar: null,
              };
            }
          }
        }

        try {
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/v1/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (loginResponse.status !== 200) {
            throw new Error("Login failed");
          }

          // Backend mengembalikan: { access_token, token_type, user }
          const { access_token, user } = loginResponse.data;

          // Fallback check: jika ada message error di response (untuk keamanan tambahan)
          if (loginResponse.data.message === "Invalid credentials") {
            throw new Error("Invalid email or password");
          }

          if (!access_token || !user) {
            throw new Error("Invalid response from server");
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            accessToken: access_token,
            role: user.role,
            avatar: user.avatar || null,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // Network error (backend cannot be reached)
            if (!error.response) {
              if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
                throw new Error(
                  "Cannot connect to server. Please make sure the backend is running at " +
                    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}`,
                );
              } else if (error.code === "ETIMEDOUT") {
                throw new Error(
                  "Connection timeout. Server is not responding.",
                );
              } else {
                throw new Error(
                  `Network error: ${error.message || "Cannot connect to server"}`,
                );
              }
            }

            // HTTP error response
            const status = error.response?.status ?? 0;

            if (status === 401) {
              throw new Error("Invalid email or password");
            } else if (status === 404) {
              throw new Error("User not found");
            } else if (status === 422) {
              // Validation error dari Laravel
              const errors = error.response?.data?.errors;
              if (errors) {
                // Ambil pesan error pertama dari field manapun
                const firstError = Object.values(errors)[0];
                const errorMessage = Array.isArray(firstError)
                  ? firstError[0]
                  : firstError ||
                    error.response?.data?.message ||
                    "Validation failed";
                throw new Error(errorMessage);
              }
              throw new Error(
                error.response?.data?.message || "Validation failed",
              );
            } else if (status >= 500) {
              throw new Error("Server error. Please try again later");
            } else {
              throw new Error(error.response?.data?.message || "Login failed");
            }
          }

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("An unexpected error occurred");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};
