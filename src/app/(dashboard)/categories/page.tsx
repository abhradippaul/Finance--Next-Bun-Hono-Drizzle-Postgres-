"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { UseGetCategories } from "@/features/categories/api/UseGetCategories";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { UseBulkDeleteCategories } from "@/features/categories/api/UseDeleteCategory";
import { onOpen } from "@/redux/slices/NewCategory";

function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = UseGetCategories();
  const data = categories.data || [];
  const deleteCategories = UseBulkDeleteCategories();

  if (categories.isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Categories page</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              dispatch(onOpen(undefined));
              console.log("Test");
            }}
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map(({ original: { id } }) => id);
              deleteCategories.mutate({ ids });
            }}
            disabled={deleteCategories.isPending || false}
          />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CategoriesPage;
