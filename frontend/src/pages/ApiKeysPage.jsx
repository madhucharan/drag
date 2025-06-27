import GenerateApiKeyDialog from "@/components/GenerateApiKeyDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ApiKeysPage = () => {
  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">API Keys</h1>
        <GenerateApiKeyDialog />
        {/* <Button className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 rounded-md hover:cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Generate new API key
        </Button> */}
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
    </div>
  );
};

export default ApiKeysPage;
