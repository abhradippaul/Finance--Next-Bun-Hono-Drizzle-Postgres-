"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import { Calendar } from "./ui/calendar";

function DateFilter() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const accountId = params.get("accountId") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);
  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    router.push(
      `${pathname}?accountId=${accountId}&from=${format(
        dateRange?.from || defaultFrom,
        "yyyy-MM-dd"
      )}&to=${format(dateRange?.to || defaultTo, "yyyy-MM-dd")}`
    );
  };

  const onReset = () => {
    setDate(undefined);
    router.replace(pathname);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition w-full"
        >
          <span>
            {paramState.from.toDateString()} - {paramState.to.toDateString()}
          </span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <Button
            onClick={onReset}
            disabled={!date?.from || !date.to}
            className="w-full"
            variant="outline"
          >
            Reset
          </Button>
        </div>
        <div className="p-4 w-full flex items-center gap-x-2">
          <Button
            onClick={() => pushToUrl(date)}
            disabled={!date?.from || !date.to}
            className="w-full"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateFilter;
