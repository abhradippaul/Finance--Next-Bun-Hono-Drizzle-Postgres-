import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { cn } from "@/lib/utils";
import { onOpen } from "@/redux/slices/NewCategory";
import { TriangleAlert } from "lucide-react";

interface Props {
  id: string;
  categoryId?: string | null;
  categoryName?: string | null;
}

function CategoryColumn({ categoryId, categoryName }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !categoryName && "text-rose-500"
      )}
      onClick={() => categoryId && dispatch(onOpen(categoryId))}
    >
      {categoryName || "Uncategorized"}
      {!categoryName && <TriangleAlert className="mr-2 size-4 shrink-0" />}
    </div>
  );
}

export default CategoryColumn;
