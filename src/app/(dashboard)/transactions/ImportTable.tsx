import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableHeadSelect from "./TableHeadSelect";

interface Props {
  header: string[];
  data: string[][];
  selectedColumn: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}

function ImportTable({
  data,
  header,
  onTableHeadSelectChange,
  selectedColumn,
}: Props) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            {header.map((e, i) => (
              <TableHead key={e}>
                <TableHeadSelect
                  columnIndex={i}
                  selectedColumns={selectedColumn}
                  onChange={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell) => (
                <TableCell key={cell}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ImportTable;
