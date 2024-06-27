import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";
export const UseGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.v1.categories.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const { categories } = await response.json();
      return categories;
    },
  });
  return query;
};
