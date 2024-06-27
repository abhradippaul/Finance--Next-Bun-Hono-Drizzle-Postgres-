import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";
export const UseGetSpecificCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await client.api.v1.categories[":id"].$get({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
