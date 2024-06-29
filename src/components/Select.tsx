import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface Props {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { id: string; name: string }[];
  value: string | null | undefined;
  type: "account" | "category";
  placeholder?: string;
  disabled?: boolean;
}

function Select({
  onChange,
  onCreate,
  value,
  disabled,
  options,
  placeholder,
  type,
}: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full"
        >
          {value ? options?.find(({ id }) => id === value)?.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command className="w-full">
          <CommandInput
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
            onChangeCapture={(e) => setInputValue(e.currentTarget.value)}
          />
          <CommandList>
            {inputValue && (
              <CommandEmpty className="p-0 m-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full m-0"
                  onClick={() => onCreate && inputValue && onCreate(inputValue)}
                >
                  Create ({inputValue}) {type}
                </Button>
              </CommandEmpty>
            )}
            {options?.length ? (
              <CommandGroup>
                {options?.map(({ id, name }) => (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => {
                      onChange(id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div></div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Select;
