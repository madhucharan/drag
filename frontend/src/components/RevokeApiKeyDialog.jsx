import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useApiKeyStore } from "@/store/ApiKeyStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

const RevokeApiKeyDialog = () => {
  const { isRevokeOpen, selectedKeyId, closeRevoke, setLoading, loading } =
    useApiKeyStore();

  const { makeRequest } = useApi();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (keyId) => makeRequest(`keys/${keyId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] }).then(() => {
        // Wait for invalidation to complete
        console.log("invalidated revokation");
        setLoading(false);
        closeRevoke();
      });
    },
    onError: (err) => {
      console.error("Failed to revoke:", err);
      setLoading(false);
    },
    // Remove onSettled completely
  });

  const handleRevoke = () => {
    if (!selectedKeyId) return;
    setLoading(true);
    // 4) pass selectedKeyId explicitly here
    mutation.mutate(selectedKeyId);
  };

  return (
    <AlertDialog
      open={isRevokeOpen}
      onOpenChange={(val) => !val && closeRevoke()}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. The API key will be permanently revoked
            and cannot be used again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={closeRevoke}
            disabled={loading}
            className="hover:cursor-pointer active:scale-98 transition-all duration-150"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRevoke}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 active:scale-98 transition-all duration-150 hover:cursor-pointer"
          >
            {loading ? "Revoking..." : "Revoke"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RevokeApiKeyDialog;
