"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IoLogOut } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import {
  RiMenu4Fill,
  RiDashboardHorizontalFill,
  RiCompassFill,
} from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { PiBookOpenFill } from "react-icons/pi";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NextIntlClientProvider } from "next-intl";
import enMessage from "../../messages/en.json";
import Header from "@/components/container/header";
import { Role } from "@/types/auth";

const navigation = [
  {
    name: "My Profile",
    href: "/dashboard/profile",
    icon: <FaCircleUser size={32} />,
  },
  {
    name: "Dashboard",
    icon: <RiDashboardHorizontalFill size={32} />,
    children: [
      { name: "Summary", href: "/dashboard/summary" },
      { name: "Reading", href: "/dashboard/reading" },
      { name: "Listening", href: "/dashboard/listening" },
      { name: "Speaking", href: "/dashboard/speaking" },
      { name: "Writing", href: "/dashboard/writing" },
    ],
  },
  {
    name: "Class",
    href: "/dashboard/class",
    icon: <HiUserGroup size={32} />,
  },
  {
    name: "Vocabulary",
    href: "/dashboard/vocabulary",
    icon: <PiBookOpenFill size={32} />,
  },
  {
    name: "Discover Test",
    href: "/dashboard/test",
    icon: <RiCompassFill size={32} />,
  },
];

const SideBarMenu = ({
  onItemClick,
  onLogout,
}: {
  onItemClick?: () => void;
  onLogout?: () => void;
}) => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.STUDENT,
    },
  });
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      {navigation.map((nav, index) => {
        const isActive =
          pathname === nav.href ||
          nav.children?.some((child) => child.href === pathname);

        return nav.children ? (
          <Collapsible
            key={index}
            open={openMenu === nav.name}
            onOpenChange={() =>
              setOpenMenu(openMenu === nav.name ? null : nav.name)
            }
            className={cn(
              "-ml-0.5 rounded-r-3xl border",
              isActive
                ? "border-primary border-y border-r shadow-[0_0_10px_0.5px_rgba(122,157,88,0.7)]"
                : "border-transparent",
            )}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-r-3xl py-4 pr-3 text-left text-xl font-medium transition-colors hover:cursor-pointer",
                  isActive
                    ? "bg-background text-primary"
                    : "hover:text-primary",
                )}
              >
                <span className="flex items-center gap-2">
                  {nav.icon}
                  {nav.name}
                </span>
                <IoMdArrowDropright
                  className={cn(
                    "transition-transform",
                    openMenu === nav.name && "rotate-90",
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mb-3 ml-3 flex flex-col gap-2 py-1">
                {nav.children
                  ?.filter((child) => {
                    if (session.user.role === Role.TEACHER) {
                      // kalau teacher, cuma tampilkan Summary
                      return child.name === "Summary";
                    }
                    // kalau user, tampilkan semua
                    return true;
                  })
                  .map((child, idx) => {
                    const activeChild = pathname === child.href;
                    return (
                      <Link
                        key={idx}
                        href={child.href}
                        onClick={onItemClick}
                        className={cn(
                          "group flex items-center gap-2 py-1.5 text-base font-medium transition-colors",
                          activeChild
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        <IoMdArrowDropright
                          className={activeChild ? "text-primary" : ""}
                        />
                        {child.name}
                      </Link>
                    );
                  })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link
            href={nav.href!}
            key={index}
            onClick={onItemClick}
            className={cn(
              "hover:text-primary flex items-center gap-2 rounded-r-3xl border-y border-r py-4 pr-3 text-xl font-medium transition-colors hover:cursor-pointer",
              isActive
                ? "bg-background border-primary text-primary shadow-[0_0_10px_0.5px_rgba(122,157,88,0.7)]"
                : "border-transparent",
            )}
          >
            {nav.icon}
            {nav.name}
          </Link>
        );
      })}

      <Button
        onClick={onLogout}
        variant="ghost"
        className="text-destructive hover:text-destructive hover:border-destructive h-[66px] justify-start gap-2 rounded-l-none rounded-r-3xl border-y border-r border-transparent text-xl hover:bg-transparent has-[>svg]:px-1 [&_svg:not([class*='size-'])]:size-8"
      >
        <IoLogOut />
        Logout
      </Button>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [ConfirmDialog, Confirm] = useConfirm(
    "Logout",
    "Are you sure you want to logout?",
  );

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const ok = await Confirm();
    if (ok) router.push("/");
  };

  return (
    <NextIntlClientProvider locale="en" messages={enMessage}>
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col px-4 md:px-8 xl:px-0">
        {/* Header */}
        <header className="border-border fixed top-0 right-0 left-0 z-30 mx-auto h-20 max-w-screen-xl border-b bg-black bg-none px-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Header
              className="static top-0 w-full px-0"
              wrapperClassName="w-full px-4 bg-transparent backdrop-blur-none rounded-none px-0 md:px-0 lg:px-0"
              iconLeft={
                <SheetTrigger asChild>
                  <Button className="md:hidden" size="icon">
                    <RiMenu4Fill />
                  </Button>
                </SheetTrigger>
              }
            />
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-xl text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="-mt-2 overflow-y-auto px-4">
                <SideBarMenu
                  onItemClick={() => setIsMenuOpen(false)}
                  onLogout={handleLogout}
                />
              </div>
            </SheetContent>
          </Sheet>
          <ConfirmDialog />
        </header>

        <div className="flex min-h-svh gap-4">
          {/* Sidebar */}
          <aside className="relative hidden w-64 border-r border-r-[oklch(0.83_0_0)] md:block">
            <div className="sticky top-28 max-h-[calc(100vh-5rem)] overflow-auto pt-4 pr-4">
              <SideBarMenu onLogout={handleLogout} />
            </div>
          </aside>

          {/* Main content */}
          <main className="mx-auto mt-28 flex w-full flex-col pb-16 md:pl-4 lg:pl-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
};

export default DashboardLayout;
