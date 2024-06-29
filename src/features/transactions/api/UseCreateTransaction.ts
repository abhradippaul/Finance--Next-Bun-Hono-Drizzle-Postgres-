import { client } from "@/db/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.v1.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.v1.transactions.$post
>["json"];

export const UseCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.v1.transactions.$post({ json });
      // if (!response.ok) toast.error("Failed to create account");
      return await response.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    onError: () => toast.error("Failed to create transaction"),
  });
  return mutation;
};
