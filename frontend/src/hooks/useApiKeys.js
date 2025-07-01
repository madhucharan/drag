import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export const useApiKeys = () => {
  const { makeRequest } = useApi();

  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => {
      // console.log("Fetching keys...");
      return makeRequest("keys/");
    },
  });
};
