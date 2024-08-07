"use client";

import { UseGetAccounts } from "@/features/accounts/api/UseGetAccount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function AccountFilter() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const { data, isLoading } = UseGetAccounts();

  const onChange = (newValue: string) => {
    if (newValue === "all") {
      router.replace(pathname);
    } else {
      router.push(`${pathname}?accountId=${newValue}&from=${from}&to=${to}`);
    }
  };

  return (
    <Select value={accountId} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {data?.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AccountFilter;
