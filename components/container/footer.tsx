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
    <div className="border-background/40 absolute -top-96 flex w-full flex-col justify-between gap-[30px] rounded-[15px] border bg-black/40 px-[25px] py-[25px] text-white backdrop-blur-xl md:-top-70 md:h-[430px] md:w-[650px] lg:-top-52 lg:h-[400px] xl:h-[300px] xl:w-[1062px]">
      <p className='className="text-[12px] font-medium"'>{t("tryitnow")}</p>
      <h2 className="text-[36px] font-bold">{t("title")}</h2>
      <h3 className="text-[22px] font-medium">{t("description")}</h3>
      <div className="flex flex-wrap gap-[34px] text-[16px]">
        <Button className="h-[57px] w-fit cursor-pointer rounded-[15px]">
          {t("ctastudent")}
        </Button>
        <Button className="border-secondary h-[57px] w-fit cursor-pointer rounded-[15px] border-2 bg-transparent">
          {t("ctateacher")}
        </Button>
      </div>
    </div>
  );
};

const NavItems = ({ title, sectionKey, items }: NavItemsProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <h4 className="text-secondary text-[28px] font-semibold">{title}</h4>
      <div className="flex flex-col gap-[10px]">
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
            <p key={key} className="text-muted-foreground text-sm">
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
    <footer className="relative flex h-full w-full items-center justify-center bg-[#333333] xl:h-[508px]">
      <CardCTAFooter />

      <div className="flex h-full w-full flex-col items-end justify-center px-[20px] pt-[200px] pb-[30px] text-white xl:px-[119px]">
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

              <div className="text-[16px]">
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
        <div className="my-[30px] w-full border border-[#dedede]"></div>

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
