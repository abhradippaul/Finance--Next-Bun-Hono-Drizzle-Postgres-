import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { cn } from "@/lib/utils";
import { onOpen } from "@/redux/slices/NewCategory";
import { onOpen as addCategory } from "@/redux/slices/NewTransaction";
import { TriangleAlert } from "lucide-react";

interface Props {
  id: string;
  categoryId?: string | null;
  categoryName?: string | null;
}

function CategoryColumn({ categoryId, categoryName, id }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !categoryName && "text-rose-500"
      )}
      onClick={() => {
        if (categoryId) {
          dispatch(onOpen(categoryId));
        } else {
          dispatch(addCategory(id));
        }
      }}
    >
      {!categoryName && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {categoryName || "Uncategorized"}
    </div>
  );
}

export default CategoryColumn;
