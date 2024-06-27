import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/app/hooks/ReduxHook";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { onClose } from "@/redux/slices/NewCategory";
import { UseGetSpecificCategory } from "../api/UseGetSpecificCategory";
import { Loader2 } from "lucide-react";

const CategoryForm = dynamic(() => import("./CategoryForm"));

function NewCategorySheet() {
  const { isOpen, id: categoryId } = useAppSelector(
    ({ categorySheet }) => categorySheet
  );
  const dispatch = useAppDispatch();
  const { data, isLoading } = UseGetSpecificCategory(categoryId);
  return (
    <Sheet open={isOpen} onOpenChange={() => dispatch(onClose())}>
      <SheetContent className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {categoryId ? "Edit category" : "New category"}
          </SheetTitle>
          <SheetDescription>
            {categoryId
              ? "Edit an existing category"
              : "Create a new category to organize your translations"}
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Loader2 className="size-8 text-slate-300 animate-spin" />
          </div>
        ) : (
          <CategoryForm defaultValue={data} id={data?.id} />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NewCategorySheet;
