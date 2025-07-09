"use client";

import Image from "next/image";
import React from "react";
import registerIllustration from "@/public/images/register-illustration.png";
import loginIllustration from "@/public/images/login-illustration.png";
import logo from "@/public/images/logo-no-bg.png";
import { usePathname } from "next/navigation";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isLoginPath = pathname === "/auth/sign-in";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-screen">
      {/* FORM */}
      <section
        className={`
          bg-[#333333] min-h-screen px-8 flex items-center justify-center overflow-y-auto py-12
          ${
            isLoginPath
              ? "lg:rounded-tr-[120px] lg:rounded-br-[120px] lg:order-1"
              : "lg:rounded-tl-[120px] lg:rounded-bl-[120px] lg:order-2"
          }
        `}
      >
        {children}
      </section>

      {/* ILLUSTRATION */}
      <section
        className={`
          px-8 items-center justify-center hidden lg:flex relative
          ${isLoginPath ? "lg:order-2" : "lg:order-1"}
        `}
      >
        <Link
          href="/"
          className={`absolute top-12 ${isLoginPath ? "right-28" : "left-28"}`}
        >
          <Image src={logo} width={180} height={43} alt="Koupii Logo" />
        </Link>
        <Image
          src={isLoginPath ? loginIllustration : registerIllustration}
          width={650}
          height={650}
          className="mt-32"
          priority
          alt={isLoginPath ? "Login Illustration" : "Register Illustration"}
        />
      </section>
    </div>
  );
};

export default AuthLayout;
