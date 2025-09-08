import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
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
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await res.json();

          if (res.ok && data.token && data.user) {
            return {
              id: data.user.id.toString(), // Ensure it's string
              email: data.user.email,
              name: data.user.name || null,
              accessToken: data.token,
            };
          }

          // Log error for debugging
          console.error(
            "Authentication failed:",
            data.message || "Unknown error",
          );
          return null;
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};
