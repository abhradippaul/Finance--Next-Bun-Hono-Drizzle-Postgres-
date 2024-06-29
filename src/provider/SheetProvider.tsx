"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NewAccountSheet = dynamic(
  () => import("@/features/accounts/components/NewAccountSheet")
);
const NewCategorySheet = dynamic(
  () => import("@/features/categories/components/NewCategorySheet")
);
const NewTransactionSheet = dynamic(
  () => import("@/features/transactions/components/NewTransactionSheet")
);

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
      <NewTransactionSheet />
    </div>
  );
}
export default SheetProvider;
