import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useApiKeyStore } from "@/store/ApiKeyStore";
import { useApi } from "@/lib/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const GenerateApiKeyDialog = () => {
  const {
    isGenerateOpen,
    openGenerate,
    closeGenerate,
    name,
    setName,
    setLoading,
    setApiKey,
    openDisplay,
    loading,
  } = useApiKeyStore();

  const { makeRequest } = useApi();

  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await makeRequest("keys/", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      const { key } = data;
      setApiKey(key);
      closeGenerate();
      openDisplay(key);
      toast.success("API key generated successfully", {
        duration: 2500,
      });

      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (err) {
      console.error("Failed to generate key:", err);
      toast.error("Failed to generate key", {
        duration: 2500,
        className: "bg-red-600 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={isGenerateOpen}
      onOpenChange={(val) => !val && closeGenerate()}
    >
      <AlertDialogTrigger asChild>
        <Button
          onClick={openGenerate}
          className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 rounded-md hover:cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate API Key
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Generate new API Key
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid gap-3">
            <label htmlFor="key-name" className="text-sm font-medium">
              Name (optional)
            </label>
            <Input
              id="key-name"
              placeholder="Key name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              disabled={loading}
              onClick={closeGenerate}
              className="hover:cursor-pointer active:scale-98 transition-all duration-150"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 hover:cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Key"
              )}
            </Button>
          </div>
        </div>

        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenerateApiKeyDialog;
