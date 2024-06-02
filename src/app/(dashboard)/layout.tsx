import Header from "@/components/Header";
import { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </div>
  );
}

export default DashboardLayout;
