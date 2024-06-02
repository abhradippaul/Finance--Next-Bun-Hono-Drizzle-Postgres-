"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";

const NavigationMobile = dynamic(() => import("./NavigationMobile"));
const NavButton = dynamic(() => import("./NavButton"));

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

function Navigation() {
  const pathname = usePathname();
  const isMoblie = useMedia("(max-width:1024px)", false);

  if (isMoblie) {
    return <NavigationMobile pathname={pathname} routes={routes} />;
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map(({ href, label }) => (
        <NavButton
          key={href}
          href={href}
          label={label}
          isActive={pathname === href}
        />
      ))}
    </nav>
  );
}

export default Navigation;
