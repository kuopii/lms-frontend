"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";
import { useFormStore } from "@/store/form-store";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdSave } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdPreview } from "react-icons/md";
import { PiCopyFill } from "react-icons/pi";

const TestLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [session] = useState({
    user: {
      name: "John Doe",
      image: "",
    },
  });

  const createLayout = [
    "/test/reading/create",
    "/test/listening/create",
    "/test/writing/create",
    "/test/speaking/create",
  ];
  const overviewLayout = ["/test/overview"];

  const isCreateLayout = createLayout.some((path) => pathname === path);
  const isOverviewLayout = overviewLayout.some((path) =>
    pathname.startsWith(path + "/"),
  );

  const { triggerSubmit, title } = useFormStore();

  if (isOverviewLayout) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-14">
        <header className="fixed top-0 right-0 left-0 z-20 mx-auto w-full">
          <div className="border-primary bg-background flex max-w-screen-2xl items-start justify-between gap-4 border-b px-4 py-6 md:px-8 lg:px-14">
            <div className="flex items-center gap-4">
              <Button variant={"ghost"} size={"iconSm"} onClick={router.back}>
                <ArrowLeft />
              </Button>
              <Link href={"/dashboard"}>
                <Image
                  src="/images/logo-no-bg.png"
                  alt="Kuopi Logo"
                  width={160}
                  height={60}
                  priority
                />
              </Link>
            </div>
            <Avatar className="h-11 w-11">
              {session.user?.image && <AvatarImage src={session.user.image} />}
              <AvatarFallback className="text-muted-foreground">
                {getInitialsFromName(session.user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="pt-24 pb-20">{children}</main>
      </div>
    );
  }

  if (isCreateLayout) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-14">
        <header className="fixed top-0 right-0 left-0 z-20 mx-auto w-full max-w-screen-2xl">
          <div className="border-primary bg-background flex flex-col items-start gap-4 border-b px-4 py-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <h1 className="text-[clamp(1.5rem,5vw,2.3rem)] font-bold text-white">
              {title}
            </h1>

            <div className="flex items-center gap-3">
              <Button
                className="[&_svg:not([class*='size-'])]:size-7"
                variant={"ghost"}
                size={"iconSm"}
              >
                <MdPreview />
              </Button>
              <Button
                className="[&_svg:not([class*='size-'])]:size-7"
                variant={"ghost"}
                size={"iconSm"}
              >
                <IoMdSave className="-rotate-90" />
              </Button>
              <Button
                className="[&_svg:not([class*='size-'])]:size-7"
                variant={"ghost"}
                size={"iconSm"}
              >
                <PiCopyFill className="-rotate-90" />
              </Button>
              <Button
                size={"xsm"}
                onClick={triggerSubmit}
                className="h-10 rounded-4xl"
              >
                Send Out Test <IoSend />
              </Button>
            </div>
          </div>
        </header>
        <main className="pt-48 pb-20 md:pt-52 lg:pt-40">{children}</main>
      </div>
    );
  }

  return <>{children}</>;
};

export default TestLayout;
