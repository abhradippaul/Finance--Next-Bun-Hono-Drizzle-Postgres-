import { client } from "@/db/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.v1.accounts.$patch>;
type RequestType = InferRequestType<
  typeof client.api.v1.accounts.$patch
>["json"];

export const UseUpdateAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.v1.accounts.$patch({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Account updated successfully");
    },
    onError: () => toast.error("Failed to edit account"),
  });
  return mutation;
};
