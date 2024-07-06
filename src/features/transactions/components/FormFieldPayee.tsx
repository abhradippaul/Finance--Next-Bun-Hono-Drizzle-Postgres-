import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  disabled: boolean;
}

function FormFieldPayee({ control, disabled }: Props) {
  return (
    <FormField
      control={control}
      name="payee"
      render={({ field }) => (
        <FormItem>
          <FormLabel> Payee </FormLabel>
          <FormControl>
            <Input
              required
              disabled={disabled}
              placeholder="Add a payee"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldPayee;
