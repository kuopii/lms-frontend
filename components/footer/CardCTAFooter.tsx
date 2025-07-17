import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

const CardCTAFooter = () => {
  const t = useTranslations("footer.card");
  return (
    <div className="border-background/40 absolute -top-96 flex w-full flex-col justify-between gap-[30px] rounded-[15px] border bg-black/40 px-[25px] py-[25px] text-white backdrop-blur-xl md:-top-70 md:h-[430px] md:w-[650px] lg:-top-52 lg:h-[400px] xl:h-[300px] xl:w-[1062px]">
      {/* <div className=" bg-radial-[at_50%_25%] from-[#7A9D58] to-[#000000]"></div> */}
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

export default CardCTAFooter;
