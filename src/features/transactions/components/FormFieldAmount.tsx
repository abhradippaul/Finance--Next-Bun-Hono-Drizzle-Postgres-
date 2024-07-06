import AmountInput from "@/components/AmountInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface Props {
  control: any;
  disabled: boolean;
}

function FormFieldAmount({ control, disabled }: Props) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel> Amount </FormLabel>
          <FormControl>
            <AmountInput
              disabled={disabled}
              value={field?.value}
              onChange={field.onChange}
              placeholder="0.00"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldAmount;
