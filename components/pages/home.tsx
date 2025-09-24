import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FaArrowCircleRight, FaQuoteRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const portraitCards = [
  {
    title: "title1",
    description: "description1",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "title2",
    description: "description2",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
  },
  {
    title: "title3",
    description: "description3",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop",
  },
] as const;

const landscapeCards = [
  {
    title: "title1",
    description: "description1",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
  },
  {
    title: "title2",
    description: "description2",
    landscapeRightSide: true,
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&h=400&fit=crop",
  },
] as const;

const skills = [
  {
    title: "title1",
  },
  {
    title: "title2",
  },
  {
    title: "title3",
  },
  {
    title: "title4",
  },
  {
    title: "title5",
  },
  {
    title: "title6",
  },
];

const testimonials = [
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
  {
    src: undefined,
    name: "name4",
    description: "description1",
    email: "email4",
  },
  {
    src: undefined,
    name: "name5",
    description: "description1",
    email: "email5",
  },
  {
    src: undefined,
    name: "name6",
    description: "description1",
    email: "email6",
  },
];

type CardProps = {
  title: string;
  description: string;
  image: string;
  index: number;
  type?: "portrait" | "landscape";
};

type CardSkillProps = {
  index: number;
  title: string;
};

const Jumbotron = () => {
  const t = useTranslations("home.banner");
  return (
    <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
      <div className="px-container container mx-auto grid w-full max-w-screen-xl grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="flex h-full w-full flex-col justify-between gap-8 pt-20 lg:gap-12 lg:pt-24">
          <div className="flex h-[70px] items-center gap-10">
            <div className="relative h-[45px] w-[135px]">
              <Image
                alt="users"
                src={"/images/ellipse-avatar.png"}
                fill
                className="object-contain"
                sizes="70px"
                priority
              />
            </div>
            <div className="flex w-[184px] flex-col gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FaStar size={20} key={idx} color="#ffffff" />
                ))}
              </div>
              <p className="text-sm text-[#DEDEDE]">{t("review")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* title */}
            <div className="flex flex-col bg-gradient-to-b from-white to-black/5 bg-clip-text text-[clamp(30px,5vw,50px)] font-extrabold text-transparent">
              <h1>{t("titleMain")}</h1>
              <span className="">{t("titleSecondary")}</span>
            </div>

            {/* desc */}
            <div className="text-neutral-custom-1 leading-relaxed font-medium">
              <p>{t("description")}</p>
            </div>
          </div>

          <div className="flex gap-4 text-[16px] text-white">
            <button className="bg-primary shadow-primary flex cursor-pointer items-center justify-center gap-2 rounded-[30px] px-[15px] py-[8px] shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]">
              {t("getStarted")}
              <FaArrowCircleRight size={20} />
            </button>

            <button className="border-primary hover:bg-primary hover:shadow-primary cursor-pointer rounded-[30px] border bg-transparent px-[15px] py-[8px] hover:shadow-[0_0_20px_rgba(0,0,0,0.25)]">
              {t("learnMore")}
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="hidden w-full items-center justify-center pt-20 md:flex lg:pt-24">
          <Image
            alt="english learning center"
            src={"/images/cartoon.png"}
            width={618.66}
            height={496.82}
            priority
            className="bg-center object-cover"
          />
        </div>
      </div>

      {/* Vector */}
      <div className="absolute top-0 -right-96 -z-10 h-full md:-right-64 lg:-right-8 xl:right-0">
        <Image
          className="h-full w-full object-cover"
          src={"/icons/vector.svg"}
          alt="vector"
          priority
          width={976}
          height={982}
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 hidden xl:block">
        <Image
          className="h-full w-full object-cover"
          src={"/icons/vector-2.svg"}
          alt="vector"
          priority
          width={976}
          height={982}
        />
      </div>
    </section>
  );
};

const CardCourse = ({
  description,
  image,
  title,
  index,
  type = "portrait",
}: CardProps) => {
  const isPortrait = type === "portrait";
  const isEven = index % 2 === 0;

  if (isPortrait) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-[#FFFFFF]/40 bg-[#333333] md:col-span-2 ${index === 2 ? "hidden md:block" : ""}`}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={800}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative flex flex-col gap-[25px] border-t border-t-[#FFC107]/40">
          <div className="absolute z-0 h-full w-full bg-radial-[at_50%_25%] from-[#FFC107] to-[#333333] to-80% opacity-30"></div>
          <div className="z-10 space-y-2 px-2 py-4 lg:px-4 lg:py-6">
            <h3 className="line-clamp-1 text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="text-description line-clamp-1 text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex items-center overflow-hidden rounded-xl border border-[#FFFFFF]/40 bg-[#333333] md:col-span-3">
      <div
        className={cn(
          "aspect-[4/3] h-full w-full overflow-hidden",
          isEven ? "order-2" : "",
        )}
      >
        <Image
          src={image}
          alt={title}
          width={800}
          height={1000}
          priority
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className={cn(
          "relative flex h-full w-3/4 flex-col justify-center space-y-2",
          isEven
            ? "border-r border-r-[#FFC107]/40"
            : "border-l border-l-[#FFC107]/40",
        )}
      >
        <div
          className={cn(
            "absolute z-0 h-full w-full opacity-30",
            isEven
              ? "bg-radial-[at_30%_30%] from-[#FFC107] to-[#333333] to-80%"
              : "bg-radial-[at_70%_30%] from-[#FFC107] to-[#333333] to-80%",
          )}
        ></div>
        <div className="z-10 space-y-2 px-2 py-4 lg:px-4 lg:py-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-description text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const CardSkill = ({ index, title }: CardSkillProps) => {
  const isEven = index % 2 === 0;
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center space-y-3 rounded-xl border border-white/40 bg-[#333333] py-4",
      )}
    >
      <div className={cn(isEven ? "pl-3 md:pl-6" : "pr-3 md:pr-6")}>
        <div
          className={cn(
            "aspect-video h-full w-full bg-white/40",
            isEven ? "rounded-l-2xl" : "rounded-r-2xl",
          )}
        ></div>
      </div>
      <h3 className="text-center text-lg font-bold">{title}</h3>
    </div>
  );
};

export default function HomePage() {
  const t = useTranslations("home.content");
  const s = useTranslations("home.content");

  return (
    <>
      <Jumbotron />
      <div className="px-container container mx-auto w-full space-y-24 pt-20 pb-52 md:pb-60 lg:space-y-32">
        <section className="aspect-video overflow-hidden rounded-2xl border">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/b4ba60j_4o8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </section>

        <section>
          <div className="leading-relaxed lg:text-center">
            <h2 className="mb-4 text-[clamp(28px,4vw,32px)] font-bold text-white">
              {t("mainFeatures.title")}
            </h2>
            <h3 className="lg:text-lg">
              <span className="text-secondary">{t("mainFeatures.brand")} </span>
              {t("mainFeatures.description")}
            </h3>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-6">
            {portraitCards.map((item, idx) => (
              <CardCourse
                key={idx}
                image={item.image}
                index={idx}
                type="portrait"
                title={s(`mainFeatures.card.potrait.${item.title}`)}
                description={s(`mainFeatures.card.potrait.${item.description}`)}
              />
            ))}

            {landscapeCards.map((item, idx) => (
              <CardCourse
                key={idx}
                image={item.image}
                index={idx}
                type="landscape"
                title={s(`mainFeatures.card.landscape.${item.title}`)}
                description={s(
                  `mainFeatures.card.landscape.${item.description}`,
                )}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="leading-relaxed lg:text-center">
            <h2 className="mb-4 text-[clamp(28px,4vw,32px)] font-bold text-white">
              {s("skills.title")}
            </h2>
            <h3 className="lg:text-lg">{s("skills.description")}</h3>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {skills.map((e, idx) => (
              <CardSkill
                key={idx}
                index={idx}
                title={t(`skills.card.${e.title}`)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="leading-relaxed lg:text-center">
            <h2 className="mb-4 text-[clamp(28px,4vw,32px)] font-bold text-white">
              {t("testimonial.title")}
            </h2>
            <h3 className="lg:text-lg">
              <span>{t("testimonial.descriptionFirst")}</span>{" "}
              <span className="text-secondary">{t("testimonial.brand")} </span>
              {t("testimonial.description")}
            </h3>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="mt-12 w-full md:px-8"
          >
            <CarouselContent>
              {testimonials.map((e, index) => (
                <CarouselItem
                  key={index}
                  className="bg-transparent md:basis-1/2 lg:basis-1/3"
                >
                  <div className="rounded-2xl border border-white/40 bg-[#333333]">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="relative mb-2 h-[70px] w-[70px]">
                            <Image
                              alt="profile"
                              src={e.src ?? "/images/profile-testi.png"}
                              className="rounded-full border object-cover"
                              fill
                              sizes="70px"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-lg font-medium">{e.name}</p>
                          <p className="text-description text-sm">{e.email}</p>
                        </div>

                        <div className="px-2 text-center text-[16px]/6">
                          <p>{t(`testimonial.card.${e.description}`)}</p>
                        </div>

                        {/* <div className="flex items-center justify-center">
                          <div className="relative h-[30px] w-[30px]">
                            <Image
                              alt="kutip"
                              src="/home/kutip.png"
                              fill
                              className="object-contain"
                              sizes="30px"
                              loading="lazy"
                            />
                          </div>
                        </div> */}
                        <FaQuoteRight color="#AAAAAA" size={20} />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious variant={"default"} className="hidden md:flex" />
            <CarouselNext variant={"default"} className="hidden md:flex" />
          </Carousel>
        </section>
      </div>
    </>
  );
}
