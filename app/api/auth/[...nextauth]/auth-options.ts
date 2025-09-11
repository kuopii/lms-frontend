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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. Ambil CSRF cookie
          const cookieRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL!}/sanctum/csrf-cookie`,
            {
              credentials: "include",
            },
          );

          console.log("COOKIE RES", cookieRes);

          // 2. Kirim login
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: "include",
            },
          );

          console.log("RESPONSE LOGIN", res);

          if (!res.ok) return null;

          // Jika backend hanya set cookie dan balikin message
          return {
            id: credentials.email,
            email: credentials.email,
            name: null,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat pertama kali login, user tersedia → simpan ke token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Extend session user dari JWT
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};
