import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertCategoriesSchema } from "@/db/Schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { UseCreateCategory } from "../api/UseCreateCategory";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { onClose } from "@/redux/slices/NewCategory";
import { UseBulkDeleteCategories } from "../api/UseDeleteCategory";
import { UseUpdateCategory } from "../api/UseUpdateCategory";
import UseConfirm from "@/app/hooks/UseConfirm";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id?: string;
  defaultValue?: FormValues;
  onSubmit?: (values: FormValues) => void;
}
function CategoryForm({ id, defaultValue }: Props) {
  const createCategory = UseCreateCategory();
  const deleteCategory = UseBulkDeleteCategories();
  const updateCategory = UseUpdateCategory(id);
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValue?.name || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (id) {
      updateCategory.mutate(
        { id, name: values.name },
        {
          onSuccess: () => {
            form.reset();
            dispatch(onClose());
          },
        }
      );
    } else {
      createCategory.mutate(values, {
        onSuccess: () => {
          form.reset();
          dispatch(onClose());
        },
      });
    }
  };

  const onDelete = () => {
    if (id) {
      deleteCategory.mutate(
        { ids: [id] },
        {
          onSuccess: () => {
            dispatch(onClose());
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Name </FormLabel>
              <FormControl>
                <Input
                  required
                  disabled={createCategory.isPending || deleteCategory.isPending}
                  placeholder="Food, Travel etc..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={createCategory.isPending}>
          {(createCategory.isPending || updateCategory.isPending) && (
            <Loader2 className="size-6 animate-spin mr-2" />
          )}
          {id ? "Save Changes" : "Create category"}
        </Button>
        {id && (
          <UseConfirm
            title="Are you sure?"
            description="You are about to delete this transaction"
            disabled={deleteCategory.isPending}
            onClickConfirm={onDelete}
            trigger={
              <Button
                type="button"
                className="w-full text-red-500 hover:text-red-600"
                disabled={deleteCategory.isPending}
                variant="outline"
              >
                {deleteCategory.isPending ? (
                  <Loader2 className="size-6 animate-spin mr-2" />
                ) : (
                  <Trash className="size-4 mr-2" />
                )}
                Delete categories
              </Button>
            }
          />
        )}
      </form>
    </Form>
  );
}

export default CategoryForm;
