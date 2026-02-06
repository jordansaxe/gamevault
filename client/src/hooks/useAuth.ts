import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      // Ignore errors on logout
    }
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
