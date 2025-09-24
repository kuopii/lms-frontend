"use client";

import { useSession } from "next-auth/react";

export function AuthIndicator() {
  const { data: session } = useSession();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex w-fit items-center justify-center rounded-full bg-gray-800 px-4 font-mono text-xs text-white">
      {session?.user ? (
        <p className="capitalize">{session.user.role}</p>
      ) : (
        <p>Not Authenticated</p>
      )}
    </div>
  );
}
