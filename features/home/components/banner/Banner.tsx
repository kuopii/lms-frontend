import { useTranslations } from "next-intl";
import { FaArrowCircleRight, FaStar } from "react-icons/fa";
import CartoonImage from "./CartoonImage";
import UsersImage from "./UsersImage";

const Banner = () => {
  const t = useTranslations("home.banner");
  return (
    <div className="flex w-full flex-col gap-14 lg:flex-row">
      {/* kiri */}
      <div className="flex h-full w-full flex-col justify-between gap-[60px]">
        <div className="flex h-[70px] items-center gap-[50px] lg:w-[369px]">
          <UsersImage />
          <div className="flex w-[184px] flex-col gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar size={20} key={idx} color="#ffffff" />
              ))}
            </div>
            <p className="text-[14px] text-[#DEDEDE]">{t("review")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-[35px]">
          {/* title */}
          <div className="flex flex-col bg-gradient-to-b from-white to-black/5 bg-clip-text text-[40px] font-extrabold text-transparent md:text-[50px] lg:text-[45px] xl:text-[55px]">
            <h1>{t("titleMain")}</h1>
            <h1 className="">{t("titleSecondary")}</h1>
          </div>

          {/* desc */}
          <div className="typoSubHeadlines text-neutral-custom-1">
            <p>{t("description")}</p>
          </div>
        </div>

        <div className="flex gap-[35px] text-[16px] text-white">
          <div className="flex">
            <button className="bg-primary shadow-primary flex cursor-pointer items-center justify-center gap-2 rounded-[30px] px-[15px] py-[8px] shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]">
              {t("getStarted")}
              <FaArrowCircleRight size={20} />
            </button>
          </div>

          <button className="border-primary hover:bg-primary hover:shadow-primary cursor-pointer rounded-[30px] border bg-transparent px-[15px] py-[8px] hover:shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            {t("learnMore")}
          </button>
        </div>
      </div>

      {/* kanan */}
      <div className="h-[300px] w-full md:h-[350px] xl:h-[500px]">
        <CartoonImage />
      </div>
    </div>
  );
};

export default Banner;
