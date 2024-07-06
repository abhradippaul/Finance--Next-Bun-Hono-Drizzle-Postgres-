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

function FormFieldCategory({ control, disabled, options, mutate }: Props) {
  return (
    <FormField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel> Category </FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              placeholder="Select a category"
              value={field.value}
              onChange={field.onChange}
              onCreate={(value) => {
                if (value) {
                  mutate({ name: value });
                }
              }}
              options={options}
              type="category"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormFieldCategory;
