// components/navbar/NavbarIntl.tsx

import { useTranslations } from "next-intl";
import NavbarComp from "./NavbarComp";

export default function NavbarIntl(props: { className?: string }) {
  const t = useTranslations("nav");

  return (
    <NavbarComp
      brandText={t("brand")}
      loginText={t("login")}
      className={props.className}
    />
  );
}
