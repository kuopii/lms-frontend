"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Test } from "@/types/discover-test";
import Image from "next/image";
import React from "react";
import { FaCirclePlay } from "react-icons/fa6";
import imageEmpty from "@/public/images/empty-test-image.png";

type CardTestProps = {
  testItem: Test;
};

export const CardTest = ({ testItem }: CardTestProps) => {
  const { attempts, name, image } = testItem;

  return (
    <Card className="h-fit cursor-pointer border border-[#FFFFFF66] bg-transparent pt-0">
      <Image
        className="h-[136px] w-full rounded-t-xl object-cover"
        width={500}
        height={300}
        src={image ?? imageEmpty}
        alt={name}
      />
      <div className="flex flex-1 flex-col justify-between gap-10">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-base leading-8 font-normal">
            {name}
          </CardTitle>
          <p className="text-foreground text-xs font-normal">
            {attempts} attempts made
          </p>
        </CardHeader>
        <CardFooter>
          <Button size="xs" className="h-7 rounded-full px-3 text-xs">
            Attempt the Test
            <FaCirclePlay className="size-[15px]" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
