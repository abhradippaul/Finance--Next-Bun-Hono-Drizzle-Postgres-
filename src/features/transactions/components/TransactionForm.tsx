import dynamic from "next/dynamic";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertTransactionsSchema } from "@/db/Schema";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { UseCreateTransaction } from "../api/UseCreateTransaction";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { onClose } from "@/redux/slices/NewTransaction";
import { UseBulkDeleteTransactions } from "../api/UseDeleteTransactions";
import { UseUpdateTransaction } from "../api/UseUpdateTransaction";
import { UseGetAccounts } from "@/features/accounts/api/UseGetAccount";
import { UseGetCategories } from "@/features/categories/api/UseGetCategories";
import { UseCreateAccount } from "@/features/accounts/api/UseCreateAccount";
import { UseCreateCategory } from "@/features/categories/api/UseCreateCategory";
import { Textarea } from "@/components/ui/textarea";
import FormFieldDatePicker from "./FormFieldDatePicker";
import AmountInput from "@/components/AmountInput";
import { useEffect } from "react";
import { toast } from "sonner";

const DatePicker = dynamic(() => import("@/components/DatePicker"));
const Select = dynamic(() => import("@/components/Select"));
const UseConfirm = dynamic(() => import("@/app/hooks/UseConfirm"));

// const formSchema = insertTransactionsSchema.omit({
//   id: true,
// });

const formSchema = z.object({
  accountId: z.string().min(1, "Account id is required"),
  amount: z.string(),
  categoryId: z.string().optional(),
  date: z.date(),
  notes: z.string().optional(),
  payee: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id?: string;
  defaultValue?: FormValues;
  onSubmit?: (values: FormValues) => void;
}
function AccountForm({ id, defaultValue }: Props) {
  const createTransaction = UseCreateTransaction();
  const deleteTransaction = UseBulkDeleteTransactions();
  const updateTransaction = UseUpdateTransaction(id);
  const dispatch = useAppDispatch();
  const getAccounts = UseGetAccounts();
  const createAccounts = UseCreateAccount();
  const getCategories = UseGetCategories();
  const createCategories = UseCreateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: defaultValue?.accountId || "",
      amount: defaultValue?.amount || "",
      categoryId: defaultValue?.categoryId || "",
      date: defaultValue?.date,
      notes: defaultValue?.notes || "",
      payee: defaultValue?.payee || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    if (id) {
      updateTransaction.mutate(
        { id, ...values },
        {
          onSuccess: () => {
            form.reset();
            dispatch(onClose());
          },
        }
      );
    } else {
      createTransaction.mutate(
        {
          ...values,
          amount: parseFloat(values.amount) * 1000,
        },
        {
          onSuccess: () => {
            form.reset();
            dispatch(onClose());
          },
        }
      );
    }
  };

  const onDelete = () => {
    if (id) {
      deleteTransaction.mutate(
        { ids: [id] },
        {
          onSuccess: () => {
            dispatch(onClose());
          },
        }
      );
    }
  };

  // useEffect(() => {
  //   const error = form.formState.errors;
  //   const errorArr = Object.keys(error);
  //   console.log(error);
  //   for (let i = 0; i < errorArr.length; i++) {
  //     const errorMessage = error[errorArr[i]].message;
  //     if (errorMessage) {
  //       toast.error(`${errorArr[i]} is required`);
  //       break;
  //     }
  //   }
  // }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormFieldDatePicker
          control={form.control}
          disabled={createTransaction.isPending || deleteTransaction.isPending}
        />

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Account </FormLabel>
              <FormControl>
                <Select
                  disabled={
                    createTransaction.isPending ||
                    deleteTransaction.isPending ||
                    getAccounts.isLoading ||
                    createAccounts.isPending
                  }
                  placeholder="Select an account"
                  value={field.value}
                  onChange={field.onChange}
                  onCreate={(value) => {
                    if (value) {
                      createAccounts.mutate({ name: value });
                    }
                  }}
                  options={getAccounts.data}
                  type="account"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Category </FormLabel>
              <FormControl>
                <Select
                  disabled={
                    createTransaction.isPending ||
                    deleteTransaction.isPending ||
                    getCategories.isLoading ||
                    createCategories.isPending
                  }
                  placeholder="Select a category"
                  value={field.value}
                  onChange={field.onChange}
                  onCreate={(value) => {
                    if (value) {
                      createCategories.mutate({ name: value });
                    }
                  }}
                  options={getCategories.data}
                  type="category"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Payee </FormLabel>
              <FormControl>
                <Input
                  required
                  disabled={
                    createTransaction.isPending ||
                    deleteTransaction.isPending ||
                    updateTransaction.isPending
                  }
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Amount </FormLabel>
              <FormControl>
                <AmountInput
                  disabled={
                    createTransaction.isPending ||
                    deleteTransaction.isPending ||
                    updateTransaction.isPending
                  }
                  // placeholder="0.00"
                  value={field?.value}
                  onChange={field.onChange}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Notes </FormLabel>
              <FormControl>
                <Textarea
                  disabled={
                    createTransaction.isPending ||
                    deleteTransaction.isPending ||
                    updateTransaction.isPending
                  }
                  placeholder="Optional notes"
                  value={field?.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          disabled={
            createTransaction.isPending ||
            getCategories.isLoading ||
            getAccounts.isLoading
          }
        >
          {(createTransaction.isPending || updateTransaction.isPending) && (
            <Loader2 className="size-6 animate-spin mr-2" />
          )}
          {id ? "Save Changes" : "Create transaction"}
        </Button>
        {id && (
          <UseConfirm
            title="Are you sure?"
            description="You are about to delete this acount."
            disabled={deleteTransaction.isPending}
            onClickConfirm={onDelete}
            trigger={
              <Button
                type="button"
                className="w-full text-red-500 hover:text-red-600"
                disabled={deleteTransaction.isPending}
                variant="outline"
              >
                {deleteTransaction.isPending ? (
                  <Loader2 className="size-6 animate-spin mr-2" />
                ) : (
                  <Trash className="size-4 mr-2" />
                )}
                Delete transaction
              </Button>
            }
          />
        )}
      </form>
    </Form>
  );
}

export default AccountForm;
