import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";
export const UseGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.v1.accounts.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch account");
      }
      const { accounts } = await response.json();
      return accounts;
    },
  });
  return query;
};
