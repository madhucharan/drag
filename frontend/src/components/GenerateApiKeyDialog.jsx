import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import ApiKeyDisplay from "./ApiKeyDisplay";
import { useApi } from "@/lib/useApi";

const GenerateApiKeyDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("form"); //form || display
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { makeRequest } = useApi();

  const resetDialog = () => {
    setName("");
    setApiKey("");
    setCopied(false);
    setStep("form");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await makeRequest("keys/", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      const { key, key_id, created_at } = data;
      setApiKey(key);
      setStep("display");
    } catch (error) {
      console.error("Failed to generate API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    if (apiKey) {
      console.log("Key created:", { name: name || "secret key", apiKey });
    }
    setOpen(false);
    resetDialog();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetDialog(); // Reset on any close
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 rounded-md hover:cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Generate API Key
        </Button>
      </DialogTrigger>

      <DialogContent
        className={loading && "[&>button]:hidden"} // hide x button while loading
        key={open ? "open" : "closed"}
        onInteractOutside={(e) => loading && e.preventDefault()}
        onEscapeKeyDown={(e) => loading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {step === "form" ? "Generate new API key" : "Copy your API key"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {step === "form" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-4"
          >
            <div className="grid gap-3">
              <label className="text-sm font-medium" htmlFor="key-name">
                Name (optional)
              </label>
              <Input
                id="key-name"
                placeholder="Key name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="hover: cursor-pointer active:scale-98 transition-all duration-150"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 hover:cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Key"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please save your secret key in a safe place since you won't be
              able to view it again. Keep it secure, as anyone with your API key
              can make requests on your behalf. If you do lose it, you'll need
              to generate a new one.
            </p>

            <ApiKeyDisplay
              keyValue={apiKey}
              copied={copied}
              onCopy={handleCopy}
            />

            <Button
              onClick={handleDone}
              className="w-full bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 hover: cursor-pointer"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateApiKeyDialog;
