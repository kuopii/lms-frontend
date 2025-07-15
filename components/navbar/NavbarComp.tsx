import { useTranslations } from "next-intl";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { FaSquare } from "react-icons/fa";
import NavbarItems from "./NavbarItems";

interface NavbarCompParams {
  className?: string;
}

const NavbarComp = ({ className }: NavbarCompParams) => {
  const t = useTranslations("nav");
  return (
    <header className="bg-primary flex items-center justify-center text-white">
      <nav className="absolute top-[60px] hidden items-center justify-between rounded-[16px] bg-black/40 px-[20px] py-[20px] backdrop-blur-xl lg:flex lg:w-[900px] lg:px-[62px] xl:w-[1344px]">
        <div className="flex items-center justify-center gap-1">
          <FaSquare size={40} color="#7a9d58" />
          <Link href={"/"} className="text-primary text-4xl font-extrabold">
            {t("brand")}
          </Link>
        </div>

        <div>
          <NavbarItems />
        </div>

        {/* kondisi jika login / belum */}
        <div className="">
          <button className="bg-primary flex cursor-pointer items-center justify-center gap-2 rounded-[30px] px-[15px] py-[8px] text-white">
            <CgProfile size={20} />
            {t("login")}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavbarComp;
