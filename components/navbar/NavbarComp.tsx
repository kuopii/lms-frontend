<<<<<<< HEAD
import { cn } from "@/lib/utils";
=======
import { useTranslations } from "next-intl";
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { FaSquare } from "react-icons/fa";
import NavbarItems from "./NavbarItems";

interface NavbarCompParams {
<<<<<<< HEAD
  brandText: string;
  loginText: string;
  className?: string;
}

const NavbarComp = ({ className, brandText, loginText }: NavbarCompParams) => {
  // const t = useTranslations("nav");

  return (
    <header className="flex items-center justify-center text-white">
      <nav
        className={cn(
          "fixed top-0 right-0 left-0 z-40 hidden h-[70px] items-center justify-between rounded-[16px] bg-black backdrop-blur-xl lg:flex",
          { className },
        )}
      >
        <div className="mx-auto flex h-[70px] w-full max-w-screen-xl items-center justify-between text-white lg:px-10 xl:px-0">
          <div className="flex items-center justify-center gap-1">
            <FaSquare size={40} color="#7a9d58" />
            <Link href={"/"} className="text-primary text-4xl font-extrabold">
              {/* {t("brand")} */}
              {brandText}
            </Link>
          </div>

          <div>
            <NavbarItems />
          </div>

          {/* kondisi jika login / belum */}
          <div>
            <button className="bg-primary flex cursor-pointer items-center justify-center gap-2 rounded-[30px] px-[15px] py-[8px] text-white">
              <CgProfile size={20} />
              {/* {t("login")} */}
              {loginText}
            </button>
          </div>
=======
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
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
        </div>
      </nav>
    </header>
  );
};

export default NavbarComp;
