import { RiDashboardHorizontalFill, RiCompassFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { PiBookOpenFill } from "react-icons/pi";

export const navLinks = {
  pages: {
    homepage: "/",
    features: "/features",
    profile: "/profile",
  },
  company: {
    aboutus: "/about",
    term: "/terms",
    blog: "/blog",
  },
} as const;

export const LANDING_PAGE_NAVIGATION = [
  { title: "home", href: "/" },
  { title: "features", href: "/features" },
  { title: "pricing", href: "/pricing" },
];

export const DASHBOARD_NAVIGATION = [
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
