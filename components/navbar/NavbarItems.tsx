"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "../localeSwitcher/LocaleSwitcher";

type Items = {
  title: string;
  url?: string;
};

const items: Items[] = [
  {
    title: "home",
    url: "/",
  },
  {
    title: "features",
    url: "/features",
  },
  {
    title: "pricing",
    url: "/pricing",
  },
];

const NavbarItems = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const normalizePath = (path: string) => path.replace(/\/$/, "");
  // console.log("pathname", pathname);
  // console.log("locale", locale);

  return (
    <div className="flex gap-[50px]">
      {items
        .filter((e) => e.url)
        .map((e) => {
          const fullHref = `/${locale}${e.url}`;
          const isActive = normalizePath(pathname) === normalizePath(fullHref);
          // console.log("isActive", isActive);

          return (
            <Link
              key={e.url}
              href={fullHref}
              className={clsx(
                "text-md flex items-center justify-center px-2 py-1 text-white decoration-2 underline-offset-4 transition-colors duration-500",
                isActive
                  ? "text-foreground decoration-primary underline"
                  : "text-muted-foreground hover:decoration-primary hover:underline",
              )}
            >
              {t(`${e.title}`)}
            </Link>
          );
        })}

      <LocaleSwitcher />
    </div>
  );
};

export default NavbarItems;
