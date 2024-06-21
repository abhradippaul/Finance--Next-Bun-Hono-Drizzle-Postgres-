import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertAccountSchema } from "@/db/Schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { UseCreateAccount } from "../api/UseCreateAccount";

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
function AccountForm({ id, defaultValue, onDelete }: Props) {
  const { mutate, isPending } = UseCreateAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValue?.name || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    mutate(values, {
      onSuccess: () => form.reset(),
    });
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
                  disabled={isPending}
                  placeholder="Cash, Bank, Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="size-6 animate-spin mr-2" />}
          {id ? "Save Changes" : "Create account"}
        </Button>
        {id && (
          <Button
            type="button"
            onClick={onDelete}
            className="w-full text-red-500 hover:text-red-600"
            disabled={isPending}
            variant="outline"
          >
            {isPending ? (
              <Loader2 className="size-6 animate-spin mr-2" />
            ) : (
              <Trash className="size-4 mr-2" />
            )}
            Delete account
          </Button>
        )}
      </form>
    </Form>
  );
}

export default AccountForm;
