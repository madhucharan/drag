// src/components/GenerateApiKeyDialog.jsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ApiKeyDisplay from "./ApiKeyDisplay";
import { DialogClose } from "@radix-ui/react-dialog";

const GenerateApiKeyDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);

  const resetDialog = () => {
    setName("");
    setApiKey("");
    setCopied(false);
  };

  const handleGenerate = () => {
    const dummyKey =
      "sk-proj-" +
      Math.random().toString(36).slice(2, 20) +
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    setApiKey(dummyKey);
  };

  const handleDone = () => {
    if (apiKey) {
      // Later: persist the key (backend/local state)
      console.log("Key created:", { name: name || "secret key", apiKey });
    }
    setOpen(false);
    // resetDialog();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 rounded-md hover:cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Generate API Key
        </Button>
      </DialogTrigger>

      <DialogContent
        onCloseAutoFocus={() => {
          resetDialog();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {!apiKey ? "Generate new API key" : "Copy your API key"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {!apiKey ? (
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
                  className="hover: cursor-pointer active:scale-98 transition-all duration-150"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 hover: cursor-pointer"
              >
                Generate Key
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
