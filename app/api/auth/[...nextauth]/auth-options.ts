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

        try {
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/login`,
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

          if (loginResponse.data.message === "Invalid credentials") {
            throw new Error("Invalid email or password");
          }

          const token = loginResponse.data.token;

          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${loginResponse.data.token}`,
              },
            },
          );

          if (res.status !== 200) {
            throw new Error("Failed to fetch user data");
          }

          const user = res.data;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: token,
            role: user.role,
            avatar: user.avatar || null,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status ?? 0;

            if (status === 401) {
              throw new Error("Invalid email or password");
            } else if (status === 404) {
              throw new Error("User not found");
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
