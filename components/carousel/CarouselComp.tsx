import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  classNameButtonPrev?: string;
  classNameButtonNext?: string;
}

export function CarouselComp({
  children,
  classNameButtonPrev,
  classNameButtonNext,
}: CarouselProps) {
  return (
    <section>
      <Carousel className="w-[410px] px-9 lg:w-[800px] xl:w-[1100px]">
        <CarouselContent className="-ml-2 gap-11">{children}</CarouselContent>
        <CarouselPrevious className={classNameButtonPrev} />
        <CarouselNext className={classNameButtonNext} />
      </Carousel>
    </section>
  );
}
