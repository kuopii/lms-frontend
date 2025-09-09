import { useLocale } from "next-intl";
import Image from "next/image";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();

  console.log("locale??", locale);

  return (
    <div className="flex items-center gap-2">
      {locale === "en" ? (
        <div className="relative h-[30px] w-[30px]">
          <Image
            src={"/home/us.png"}
            alt="english"
            sizes="30px"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative h-[30px] w-[30px]">
          <Image
            src={"/home/vietnam.svg"}
            alt="english"
            sizes="30px"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      )}
      <LocaleSwitcherSelect defaultValue={locale} label="Select Language" />
    </div>
  );
}
