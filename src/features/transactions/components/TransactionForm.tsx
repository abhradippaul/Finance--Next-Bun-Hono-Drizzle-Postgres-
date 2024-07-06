import dynamic from "next/dynamic";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const UseConfirm = dynamic(() => import("@/app/hooks/UseConfirm"));
const FormFieldNotes = dynamic(() => import("./FormFieldNotes"));
const FormFieldAmount = dynamic(() => import("./FormFieldAmount"));
const FormFieldPayee = dynamic(() => import("./FormFieldPayee"));
const FormFieldCategory = dynamic(() => import("./FormFieldCategory"));
const FormFieldAccount = dynamic(() => import("./FormFieldAccount"));
const FormFieldDatePicker = dynamic(() => import("./FormFieldDatePicker"));

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
    if (id) {
      updateTransaction.mutate(
        { ...values, amount: parseFloat(values.amount) * 1000 },
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

  const isLoading =
    createTransaction.isPending ||
    deleteTransaction.isPending ||
    updateTransaction.isPending ||
    getAccounts.isPending ||
    getCategories.isPending ||
    createAccounts.isPending ||
    createCategories.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormFieldDatePicker control={form.control} disabled={isLoading} />

        <FormFieldAccount
          options={getAccounts.data}
          mutate={createAccounts.mutate}
          control={form.control}
          disabled={isLoading}
        />

        <FormFieldCategory
          disabled={isLoading}
          control={form.control}
          mutate={createCategories.mutate}
          options={getCategories.data}
        />

        <FormFieldPayee control={form.control} disabled={isLoading} />

        <FormFieldAmount control={form.control} disabled={isLoading} />

        <FormFieldNotes control={form.control} disabled={isLoading} />

        <Button
          className="w-full"
          disabled={
            createTransaction.isPending ||
            getCategories.isLoading ||
            getAccounts.isLoading ||
            updateTransaction.isPending
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
