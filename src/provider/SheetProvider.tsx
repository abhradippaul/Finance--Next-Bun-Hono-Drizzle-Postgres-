"use client";

import NewAccountSheet from "@/features/accounts/components/NewAccountSheet";
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
    </div>
  );
}
export default SheetProvider;
