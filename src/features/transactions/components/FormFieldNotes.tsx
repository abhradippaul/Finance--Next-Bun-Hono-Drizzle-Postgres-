import AmountInput from "@/components/AmountInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  control: any;
  disabled: boolean;
}

function FormFieldNotes({ control, disabled }: Props) {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel> Notes </FormLabel>
          <FormControl>
            <Textarea
              disabled={disabled}
              placeholder="Optional notes"
              value={field?.value || ""}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldNotes;
