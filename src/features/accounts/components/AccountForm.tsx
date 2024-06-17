import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertAccountSchema } from "@/db/Schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id?: string;
  defaultValue?: FormValues;
  onSubmit?: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}
function AccountForm({
  id,
  defaultValue,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const handleSubmit = (values: FormValues) => {
    onSubmit?.(values);
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
                  disabled={disabled}
                  placeholder="Cash, Bank, Card"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create account"}
        </Button>
        {id && (
          <Button
            type="button"
            onClick={onDelete}
            className="w-full group"
            disabled={disabled}
            variant="outline"
          >
            <Trash className="size-4 mr-2 text-red-500 group-hover:text-red-600" />{" "}
            Delete account
          </Button>
        )}
      </form>
    </Form>
  );
}

export default AccountForm;
