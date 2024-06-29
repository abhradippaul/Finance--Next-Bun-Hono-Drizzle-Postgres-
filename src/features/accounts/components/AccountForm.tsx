import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertAccountsSchema } from "@/db/Schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { UseCreateAccount } from "../api/UseCreateAccount";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { onClose } from "@/redux/slices/NewAccounts";
import { UseBulkDeleteAccounts } from "../api/UseDeleteAccount";
import { UseUpdateAccount } from "../api/UseUpdateAccount";
import UseConfirm from "@/app/hooks/UseConfirm";

const formSchema = insertAccountsSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id?: string;
  defaultValue?: FormValues;
  onSubmit?: (values: FormValues) => void;
}
function AccountForm({ id, defaultValue }: Props) {
  const createAccount = UseCreateAccount();
  const deleteAccount = UseBulkDeleteAccounts();
  const updateAccount = UseUpdateAccount(id);
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValue?.name || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (id) {
      updateAccount.mutate(
        { id, name: values.name },
        {
          onSuccess: () => {
            form.reset();
            dispatch(onClose());
          },
        }
      );
    } else {
      createAccount.mutate(values, {
        onSuccess: () => {
          form.reset();
          dispatch(onClose());
        },
      });
    }
  };

  const onDelete = () => {
    if (id) {
      deleteAccount.mutate(
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
                  disabled={createAccount.isPending || deleteAccount.isPending}
                  placeholder="Cash, Bank, Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={createAccount.isPending}>
          {(createAccount.isPending || updateAccount.isPending) && (
            <Loader2 className="size-6 animate-spin mr-2" />
          )}
          {id ? "Save Changes" : "Create account"}
        </Button>
        {id && (
          <UseConfirm
            title="Are you sure?"
            description="You are about to delete this acount."
            disabled={deleteAccount.isPending}
            onClickConfirm={onDelete}
            trigger={
              <Button
                type="button"
                className="w-full text-red-500 hover:text-red-600"
                disabled={deleteAccount.isPending}
                variant="outline"
              >
                {deleteAccount.isPending ? (
                  <Loader2 className="size-6 animate-spin mr-2" />
                ) : (
                  <Trash className="size-4 mr-2" />
                )}
                Delete account
              </Button>
            }
          />
        )}
      </form>
    </Form>
  );
}

export default AccountForm;
