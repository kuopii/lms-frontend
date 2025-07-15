import { CarouselComp } from "@/components/carousel/CarouselComp";
import LazyImage from "@/components/imageReusable/base/LazyImage";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import CardEmbedYT from "../card/CardEmbedYT";
import CardMainFeatures from "../card/CardMainFeatures";
import CardSkills from "../card/CardSkills";

type CardItem = {
  title: string;
  description: string;
  image?: string;
  landscapeRightSide?: boolean;
};

type CardSkill = {
  titleCard: string;
  variant: "leftSide" | "rightSide";
};

export interface CardTestimonialParams {
  src?: string;
  name: string;
  email: string;
  description: string;
}

// main features
const portraitCards: CardItem[] = [
  { title: "title1", description: "description1" },
  { title: "title2", description: "description2" },
  { title: "title3", description: "description3" },
] as const;

const landscapeCards: CardItem[] = [
  { title: "title1", description: "description1" },
  { title: "title2", description: "description2", landscapeRightSide: true },
] as const;

// skills
const skillsCard: CardSkill[] = [
  {
    variant: "leftSide",
    titleCard: "title1",
  },
  {
    variant: "rightSide",
    titleCard: "title2",
  },
  {
    variant: "leftSide",
    titleCard: "title3",
  },
  {
    variant: "rightSide",
    titleCard: "title4",
  },
  {
    variant: "leftSide",
    titleCard: "title5",
  },
  {
    variant: "rightSide",
    titleCard: "title6",
  },
];

const testimonialCard: CardTestimonialParams[] = [
  {
    src: undefined,
    name: "name1",
    description: "description1",
    email: "email1",
  },
  {
    src: undefined,
    name: "name2",
    description: "description1",
    email: "email2",
  },
  {
    src: undefined,
    name: "name3",
    description: "description1",
    email: "email3",
  },
];

const ContentComp = () => {
  const t = useTranslations("home.content");
  return (
    <div className="min-h-screen px-[20px] pt-80 md:pt-[150px] xl:px-[10px]">
      <div className="text-background">
        {/* YT Embed */}
        <section className="mb-[200px]">
          <CardEmbedYT />
        </section>

        {/* Main features */}
        <section className="mb-[160px] flex flex-col items-center justify-center">
          <h2 className="typoHeadlines mb-[20px] font-bold text-white">
            {t("mainFeatures.title")}
          </h2>
          <div className="typoSubHeadlines mb-[70px] flex gap-1 font-medium">
            <h3 className="text-description">
              <span className="text-secondary">{t("mainFeatures.brand")} </span>
              {t("mainFeatures.description")}
            </h3>
          </div>

          <div className="flex flex-col gap-[30px]">
            {/* card potrait*/}
            <div className="flex flex-col items-center justify-center gap-[24px] lg:flex-row lg:flex-wrap xl:flex">
              {portraitCards.map((e, idx) => (
                <CardMainFeatures
                  variant="portrait"
                  key={idx}
                  title={t(`mainFeatures.card.potrait.${e.title}`)}
                  description={t(`mainFeatures.card.potrait.${e.description}`)}
                />
              ))}
            </div>

            {/* card landscape*/}
            <div className="flex flex-col items-center justify-center gap-[24px] lg:flex-wrap xl:flex-row">
              {landscapeCards.map((e, idx) => (
                <CardMainFeatures
                  landscapeRightSide={e.landscapeRightSide}
                  variant="landscape"
                  key={idx}
                  title={t(`mainFeatures.card.landscape.${e.title}`)}
                  description={t(
                    `mainFeatures.card.landscape.${e.description}`,
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-[160px] flex flex-col items-center justify-center text-white">
          <div>
            <div className="mb-[70px] flex flex-col items-center justify-center gap-[20px]">
              <h2 className="typoHeadlines">{t("skills.title")}</h2>
              <h3 className="typoSubHeadlines">{t("skills.description")}</h3>
            </div>
            <div className="flex flex-col items-center justify-center gap-[24px] md:flex-wrap xl:flex-row">
              {skillsCard.map((e, idx) => (
                <CardSkills
                  key={idx}
                  titleCard={t(`skills.card.${e.titleCard}`)}
                  variant={e.variant}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="flex flex-col items-center justify-center pb-[466px]">
          <div className="mb-[70px] flex flex-col gap-[20px] text-center">
            <h2 className="typoHeadlines text-white">
              {t("testimonial.title")}
            </h2>
            <div className="flex gap-1">
              <h3 className="text-description typoSubHeadlines flex flex-wrap items-center justify-center gap-1">
                <span>{t("testimonial.descriptionFirst")}</span>
                <span className="text-secondary">{t("testimonial.brand")}</span>
                {t("testimonial.description")}
              </h3>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-[45px]">
            <CarouselComp
              classNameButtonNext="hidden md:flex size-[60px] bg-primary border-none text-black cursor-pointer"
              classNameButtonPrev="hidden md:flex size-[60px] bg-primary border-none text-black cursor-pointer"
            >
              {testimonialCard.map((e, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="bg-transparent p-0 text-white">
                    <CardContent className="card-custom flex h-[323px] w-[330px] flex-col items-center justify-center gap-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative mb-2 h-[70px] w-[70px]">
                          <LazyImage
                            alt="profile"
                            src={e.src ?? "/home/ProfileTesti.png"}
                            className="rounded-full border object-cover"
                            fill
                            sizes="70px"
                          />
                        </div>
                        <p className="text-[22px] font-medium">{e.name}</p>
                        <p className="text-description text-[14px]">
                          {e.email}
                        </p>
                      </div>

                      <div className="px-2 text-center text-[16px]/6">
                        <p>{t(`testimonial.card.${e.description}`)}</p>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="relative h-[30px] w-[30px]">
                          <LazyImage
                            alt="kutip"
                            src="/home/kutip.png"
                            fill
                            className="object-contain"
                            sizes="30px"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselComp>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentComp;
