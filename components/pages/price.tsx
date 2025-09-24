import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaCircleArrowRight, FaDollarSign } from "react-icons/fa6";
import { MdDone } from "react-icons/md";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type CardPricingType = {
  popular?: boolean;
  description: string;
  getstarted: string;
  information: string[];
  price: string;
  title: string;
};

const CardPricing = ({
  popular,
  description,
  getstarted,
  information,
  price,
  title,
}: CardPricingType) => {
  return (
    <div
      className={`card-custom hover:shadow-primary z-10 w-full p-6 text-white hover:border hover:shadow-[0_0_20px_rgba(0,0,0,0.25)] md:max-w-sm ${
        popular
          ? "shadow-primary shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] lg:scale-105"
          : "border-none lg:scale-95"
      }`}
    >
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold">{title}</h4>
          {popular && <Badge variant={"custom"}>Popular</Badge>}
        </div>
        <p className="text-sm">{description}</p>

        <div className="flex gap-1">
          <FaDollarSign size={40} color="#49D92D" />
          <p className="mt-2 text-5xl font-extrabold">{price}</p>
        </div>

        <Button
          size={"xsm"}
          className="justify-between [&_svg:not([class*='size-'])]:size-5"
        >
          {getstarted}
          <FaCircleArrowRight />
        </Button>
        <div>
          <ul className="flex flex-col gap-4">
            {information.map((e, idx) => (
              <li
                key={idx}
                className={cn(
                  "flex flex-col gap-4 border-b border-b-white/40 py-2 text-sm",
                  idx === information.length - 1 && "border-none",
                )}
              >
                <div className="flex items-center gap-2">
                  <MdDone size={16} color="#7a9d58" />
                  <p>{e}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PricePage = () => {
  const t = useTranslations("pricing");

  const cardPricingItems = t.raw("card") as {
    title: string;
    price: string;
    description: string;
    getstarted: string;
    information: string[];
    popular?: boolean;
  }[];

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <div className="px-container container mx-auto pt-36 pb-52 md:pb-60">
        <div className="text-center leading-relaxed">
          <h2 className="mb-4 text-[clamp(28px,4vw,32px)] font-bold text-white">
            {t("title")}
          </h2>
          <p className="lg:text-lg">{t("description")}</p>
        </div>
        <section className="relative mt-14">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:place-items-center lg:grid-cols-3">
            <div className="absolute -top-44 z-0 h-[800px] w-full bg-radial-[at_50%_50%] from-[#7a9d58] via-[#FFC107] to-70% opacity-15"></div>
            {cardPricingItems.map((e, idx) => (
              <CardPricing
                key={idx}
                popular={e.popular}
                description={e.description}
                getstarted={e.getstarted}
                information={e.information}
                price={e.price}
                title={e.title}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricePage;
