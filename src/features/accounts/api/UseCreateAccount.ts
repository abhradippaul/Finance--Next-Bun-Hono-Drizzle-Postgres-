import { client } from "@/db/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.v1.accounts.$post>;
type RequestType = InferRequestType<
  typeof client.api.v1.accounts.$post
>["json"];

export const UseCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.v1.accounts.$post({ json });
      // if (!response.ok) toast.error("Failed to create account");
      return await response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
    onError: () => toast.error("Failed to create account"),
  });
  return mutation;
};
