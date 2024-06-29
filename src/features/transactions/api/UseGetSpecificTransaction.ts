import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";

export const UseGetSpecificTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.v1.transactions[":id"].$get({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
