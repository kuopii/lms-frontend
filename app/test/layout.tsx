import { Button } from "@/components/ui/button";
import React from "react";
import { PiCopyFill } from "react-icons/pi";
import { IoMdSave } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdPreview } from "react-icons/md";

const TestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-14">
      <header className="fixed top-0 right-0 left-0 z-10 mx-auto w-full max-w-screen-2xl">
        <div className="border-primary bg-background flex flex-col items-start gap-4 border-b px-4 pt-12 pb-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <h1 className="text-[clamp(1.5rem,5vw,2.3rem)] font-bold text-white">
            Create a New Reading Test
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
            <Button size={"xsm"} className="h-10 rounded-4xl">
              Send Out Test <IoSend />
            </Button>
          </div>
        </div>
      </header>
      <main className="pt-52 pb-20 md:pt-56 lg:pt-44">{children}</main>
    </div>
  );
};

export default TestLayout;
