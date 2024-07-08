import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

const options = ["amount", "payee", "notes", "date"];

function TableHeadSelect({ columnIndex, onChange, selectedColumns }: Props) {
  const currentSelection = selectedColumns[`column_${columnIndex}`];
  return (
    <Select
      value={currentSelection || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelection && "text-blue-500"
        )}
      >
        <SelectValue placeholder="skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip" className="capitalize">
          skip
        </SelectItem>
        {options.map((e, i) => {
          return (
            <SelectItem
              value={e}
              key={e}
              // disabled={columnIndex === i}
              className="capitalize"
            >
              {e}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default TableHeadSelect;
