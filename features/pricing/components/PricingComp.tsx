import { useTranslations } from "next-intl";
import CardPricing from "./CardPricing";

const PricingComp = () => {
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
    // md:pb-0 pb-13
    <section className="relative flex w-full flex-col items-center justify-center gap-[70px]">
      <div className="z-10 flex flex-col gap-[20px] text-center">
        <h2 className="typoHeadlines">{t("title")}</h2>
        <h3 className="typoSubHeadlines">{t("description")}</h3>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-5 lg:flex-row lg:flex-wrap">
        <div className="absolute z-0 h-[800px] w-full bg-radial-[at_50%_50%] from-[#7a9d58] via-[#FFC107] to-70% opacity-15"></div>
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
  );
};

export default PricingComp;
