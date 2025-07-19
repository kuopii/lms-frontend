"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CgProfile } from "react-icons/cg";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import logo from "@/public/images/logo-no-bg.png";
import { Role } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";

const navigation = [
  { title: "home", href: "/" },
  { title: "features", href: "/features" },
  { title: "pricing", href: "/pricing" },
];

const NavigationItems = ({
  className,
  buttonClassName,
  onOpenSidebar,
}: {
  className?: string;
  buttonClassName?: string;
  onOpenSidebar?: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");
  const session: { user?: { name: string; role: Role; image: string } } = {
    // user: {
    //   name: "John Doe",
    //   role: Role.STUDENT,
    //   image: "/path/to/image.jpg",
    // },
  };

  const isDashbordPath = pathname.startsWith("/dashboard");

  const handleChangeLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as Locale });
  };

  const getFlagSrc = (locale: string) => {
    switch (locale) {
      case "en":
        return "/home/us.png";
      case "vi":
        return "/home/vietnam.svg";
      default:
        return "/home/globe.png";
    }
  };

  return (
    <>
      {isDashbordPath ? null : (
        <div className={cn("flex items-center gap-[50px]", className)}>
          {navigation.map(({ title, href }) => {
            const fullHref = `/${locale}${href}`;
            const currentPath = `/${locale}${pathname === "/" ? "" : pathname}`;
            const targetPath = fullHref.replace(/\/$/, "");

            const isActive = currentPath === targetPath;

            return (
              <Link
                key={href}
                onClick={() => onOpenSidebar?.(false)}
                href={fullHref}
                className={clsx(
                  "flex items-center justify-center px-2 py-1 text-base text-white decoration-2 underline-offset-4 transition-colors duration-500",
                  isActive
                    ? "text-foreground decoration-primary underline"
                    : "text-muted-foreground hover:decoration-primary hover:underline",
                )}
              >
                {t(title)}
              </Link>
            );
          })}

          <div className="flex items-center gap-2">
            <div className="relative h-[30px] w-[30px]">
              <Image
                src={getFlagSrc(locale)}
                alt={locale}
                width={30}
                height={30}
                loading="lazy"
                className="h-7 w-7 object-cover"
              />
            </div>

            <Select defaultValue={locale} onValueChange={handleChangeLocale}>
              <SelectTrigger className="h-8 w-[80px] cursor-pointer border-none bg-transparent capitalize focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {routing.locales.map((loc) => (
                  <SelectItem
                    key={loc}
                    value={loc}
                    className="cursor-pointer capitalize"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {session.user ? (
        <Avatar className="h-11 w-11">
          <AvatarImage src={session.user.image} />
          <AvatarFallback className="text-muted-foreground">
            {getInitialsFromName(session.user.name)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button
          onClick={() => router.push("/auth/sign-in")}
          className={cn(
            "h-10 rounded-full [&_svg:not([class*='size-'])]:size-5",
            buttonClassName,
          )}
          size={"xs"}
        >
          <CgProfile size={20} />
          {t("login")}
        </Button>
      )}
    </>
  );
};

const Header = ({
  className,
  wrapperClassName,
  iconLeft,
}: {
  className?: string;
  wrapperClassName?: string;
  iconLeft?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [openSidebar, setOpenSidebar] = useState(false);

  const isDashbordPath = pathname.startsWith("/dashboard");

  return (
    <header className={cn("fixed top-10 right-0 left-0 z-40", className)}>
      <div
        className={cn(
          "mx-auto flex max-w-[1344px] items-center justify-between rounded-3xl bg-black/40 px-4 py-5 backdrop-blur-xl md:px-8 lg:px-16",
          wrapperClassName,
        )}
      >
        <div className="flex items-center gap-4">
          {iconLeft}
          <Link href={isDashbordPath ? "/dashboard/profile" : "/"}>
            <Image src={logo} width={177} height={40} alt="logo" priority />
          </Link>
        </div>
        <NavigationItems
          className="hidden lg:flex"
          buttonClassName={cn(
            "ml-auto",
            "lg:ml-0",
            isDashbordPath ? "mr-0 lg:mr-0" : "mr-4 lg:mr-0",
          )}
        />

        {isDashbordPath ? null : (
          <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden" size={"icon"}>
                <AlignJustify />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex w-full flex-col gap-12 px-4">
                <NavigationItems
                  onOpenSidebar={setOpenSidebar}
                  className="flex flex-col"
                  buttonClassName="hidden"
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
