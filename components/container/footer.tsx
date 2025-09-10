import en from "@/messages/en.json";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  FaCircle,
  FaCopyright,
  FaFacebook,
  FaInstagram,
  FaSquare,
  FaTiktok,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { navLinks } from "@/data/navigations";

export const socialIconMap = {
  tiktok: {
    icon: FaTiktok,
    url: "https://tiktok.com/@yourpage",
  },
  facebook: {
    icon: FaFacebook,
    url: "https://facebook.com/yourpage",
  },
  instagram: {
    icon: FaInstagram,
    url: "https://instagram.com/yourpage",
  },
} satisfies Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    url: string;
  }
>;

type NavItemsProps = {
  title: string;
  sectionKey: keyof typeof navLinks; // agar bisa mapping url
  items: Record<string, string>;
};

const CardCTAFooter = () => {
  const t = useTranslations("footer.card");
  return (
    <div className="border-background/40 absolute -top-40 flex w-full flex-col justify-between gap-7 rounded-2xl border bg-black/40 px-6 py-6 text-white backdrop-blur-xl md:-top-36 md:w-6/7 lg:max-w-screen-lg">
      <p className='font-medium" text-sm'>{t("tryitnow")}</p>
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <h3 className="text-sm font-medium md:text-base">{t("description")}</h3>
      <div className="flex flex-wrap gap-4">
        <Button size={"xsm"}>{t("ctastudent")}</Button>
        <Button
          size={"xsm"}
          variant={"outline"}
          className="border-primary hover:bg-primary hover:text-white"
        >
          {t("ctateacher")}
        </Button>
      </div>
    </div>
  );
};

const NavItems = ({ title, sectionKey, items }: NavItemsProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-secondary text-2xl font-semibold">{title}</h4>
      <div className="flex flex-col gap-2.5">
        {Object.entries(items).map(([key, label]) => {
          const href =
            navLinks?.[sectionKey]?.[
              key as keyof (typeof navLinks)[typeof sectionKey]
            ];
          return href ? (
            <div key={key} className="flex flex-col">
              <Link href={href}>{label}</Link>
            </div>
          ) : (
            <p key={key} className="text-muted-foreground">
              {label}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const Footer = () => {
  const t = useTranslations("footer");

  const { footer } = en;
  const navigations = footer.navigation;

  return (
    <footer className="relative flex h-full w-full items-center justify-center bg-[#333333]">
      <CardCTAFooter />

      <div className="px-container container flex h-full w-full max-w-screen-xl flex-col items-end justify-center pt-48 pb-7 text-white md:pt-40">
        <div className="flex h-full w-full flex-col justify-between gap-10 lg:h-[208px] lg:flex-row">
          {/* information */}
          <div className="h-full md:w-[408px]">
            <div className="flex h-full flex-col justify-between gap-5">
              <div className="flex gap-1">
                <FaSquare size={40} color="#7a9d58" />
                <h2 className="text-primary text-4xl font-extrabold">
                  {t("brand")}
                </h2>
              </div>

              <div>
                <h3>{t("description")}</h3>
              </div>

              <div className="flex w-full gap-[15px]">
                {Object.entries(socialIconMap).map(
                  ([platform, { icon: Icon, url }]) => (
                    <div key={platform}>
                      <Link href={url}>
                        <Icon
                          className="bg-secondary rounded-full p-2 text-[#333333]"
                          size={40}
                        />
                      </Link>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* navigation */}
          <div className="flex flex-wrap gap-[70px] md:justify-between">
            {Object.entries(navigations).map(([sectionKey, sectionValue]) => {
              const sectionType = sectionKey as keyof typeof navLinks;
              const { title, ...rest } = sectionValue;
              return (
                <NavItems
                  key={sectionKey}
                  title={title}
                  items={rest}
                  sectionKey={sectionType}
                />
              );
            })}
          </div>
        </div>
        {/* garis */}
        <div className="my-7 w-full border border-[#dedede]"></div>

        {/* copyright */}
        <div className="flex w-full items-center justify-center text-[12px] font-medium">
          <ul className="flex gap-1">
            <li className="flex items-center justify-center gap-1">
              {t("copyright.title")} <FaCopyright color="#aec597" size={15} />{" "}
              {t("copyright.year")}
            </li>
            <li className="flex items-center justify-center gap-1">
              <FaCircle size={5} /> {t("copyright.brand")}
            </li>
            <li className="flex items-center justify-center gap-1">
              <FaCircle size={5} /> {t("copyright.allrightreserved")}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
