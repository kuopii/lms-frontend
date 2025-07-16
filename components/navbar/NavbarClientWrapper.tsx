"use client";

import NavbarIntl from "./NavbarIntl";

export default function NavbarClientWrapper(props: { className?: string }) {
  return <NavbarIntl className={props.className} />;
}
