"use client";

import dynamic from "next/dynamic";

const NewAccountSheet = dynamic(
  () => import("@/features/accounts/components/NewAccountSheet")
);
const NewCategorySheet = dynamic(
  () => import("@/features/categories/components/NewCategorySheet")
);
import { useEffect, useState } from "react";

function SheetProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div>
      <NewAccountSheet />
      <NewCategorySheet />
    </div>
  );
}
export default SheetProvider;
