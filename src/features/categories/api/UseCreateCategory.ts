import { client } from "@/db/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.v1.categories.$post>;
type RequestType = InferRequestType<
  typeof client.api.v1.categories.$post
>["json"];

export const UseCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.v1.categories.$post({ json });
      // if (!response.ok) toast.error("Failed to create account");
      return await response.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => toast.error("Failed to create category"),
  });
  return mutation;
};
