import DatePicker from "@/components/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

interface Props {
  control: any;
  disabled: boolean;
}

function FormFieldDatePicker({ control, disabled }: Props) {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DatePicker
              disabled={disabled}
              onChange={field.onChange}
              value={field?.value}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldDatePicker;
