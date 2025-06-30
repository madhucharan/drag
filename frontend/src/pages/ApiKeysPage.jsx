import GenerateApiKeyDialog from "@/components/GenerateApiKeyDialog";

const ApiKeysPage = () => {
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
          Do not share your API key with others or expose it in the browser or
          other client-side code.
        </p>
      </div>
      <hr className="mt-6 border-t border-muted" />
    </div>
  );
};

export default ApiKeysPage;
