import Header from "@/components/Header";
// import SheetProvider from "@/provider/SheetProvider";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
const SheetProvider = dynamic(() => import("@/provider/SheetProvider"));

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SheetProvider />
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </div>
  );
}

export default DashboardLayout;
