import { trpc } from "@/lib/trpc";

export function useAuth() {
  const me = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  return {
    user: me.data ?? null,
    loading: me.isLoading,
    error: me.error,
    isAuthenticated: Boolean(me.data),
    logout: () => logoutMutation.mutate(),
  };
}
