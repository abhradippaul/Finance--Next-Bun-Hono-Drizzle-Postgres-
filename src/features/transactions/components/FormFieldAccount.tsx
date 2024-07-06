import Select from "@/components/Select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface Props {
  control: any;
  disabled: boolean;
  options:
    | {
        id: string;
        name: string;
      }[]
    | undefined;
  mutate: ({ name }: { name: string }) => void;
}

function FormFieldAccount({ control, disabled, options, mutate }: Props) {
  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel> Account </FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              placeholder="Select an account"
              value={field.value}
              onChange={field.onChange}
              onCreate={(value) => {
                if (value) {
                  mutate({ name: value });
                }
              }}
              options={options}
              type="account"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldAccount;
