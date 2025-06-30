import { useState } from "react";
import { useApiKeys, useRevokeApiKey } from "@/lib/useApiKeys";
import GenerateApiKeyDialog from "@/components/GenerateApiKeyDialog";
import ApiKeyTable from "@/components/ApiKeyTable";
import ConfirmRevokeDialog from "@/components/ConfirmRevokeDialog";

const ApiKeysPage = () => {
  const { data: apiKeys, isLoading, isError } = useApiKeys();
  console.log("apiKeys", apiKeys);
  const revokeMutation = useRevokeApiKey();

  const [selectedKeyId, setSelectedKeyId] = useState(null);

  const handleRevoke = (keyId) => {
    setSelectedKeyId(keyId);
  };

  const handleConfirmRevoke = () => {
    if (!selectedKeyId) return;
    revokeMutation.mutate(selectedKeyId, {
      onSuccess: () => setSelectedKeyId(null),
    });
  };

  const handleCancelRevoke = () => {
    if (!revokeMutation.isLoading) setSelectedKeyId(null);
  };

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">API Keys</h1>
        <GenerateApiKeyDialog />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          View and manage your API keys. You’ll only see a key once when it's
          created.
        </p>
        <p className="text-sm text-muted-foreground">
          Do not share your API key with others or expose it in client-side
          code.
        </p>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading keys...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Failed to load API keys.</p>
        ) : (
          <ApiKeyTable apiKeys={apiKeys} onRevoke={handleRevoke} />
        )}
      </div>

      <ConfirmRevokeDialog
        open={!!selectedKeyId}
        onCancel={handleCancelRevoke}
        onConfirm={handleConfirmRevoke}
        loading={revokeMutation.isLoading}
      />
    </div>
  );
};

export default ApiKeysPage;
