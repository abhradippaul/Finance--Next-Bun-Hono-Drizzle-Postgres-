import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  routes: {
    href: string;
    label: string;
  }[];
  pathname: string;
}

function NavigationMobile({ routes, pathname }: Props) {
  const route = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (href: string) => {
    route.push(href);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 transition"
          // onClick={() => setIsOpen(true)}
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <nav className="flex flex-col gap-y-2 pt-6">
          {routes.map(({ href, label }) => (
            <Button
              className="w-full justify-start"
              key={href}
              variant={href === pathname ? "secondary" : "ghost"}
              onClick={() => onClick(href)}
            >
              {label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default NavigationMobile;
