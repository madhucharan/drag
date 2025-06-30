import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useApiKeyStore } from "@/store/ApiKeyStore";
import { Input } from "./ui/input";

const DisplayApiKeyDialog = () => {
  const { isDisplayOpen, apiKey, closeDisplay } = useApiKeyStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AlertDialog
      open={isDisplayOpen}
      onOpenChange={(val) => !val && closeDisplay()}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Copy your API key
          </AlertDialogTitle>
          <AlertDialogDescription>
            This is the only time you’ll be able to view this key. Please store
            it securely.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          {/* <div className="bg-muted px-4 py-3 rounded-md font-mono text-sm break-all border border-border">
            {apiKey}
          </div> */}
          <Input
            ref={(el) => {
              if (el) {
                el._selectedOnce = true;
                el.onfocus = () => el.select();
                el.select();
              }
            }}
            readOnly
            type="text"
            value={apiKey}
            className="font-mono text-sm pr-10 w-full bg-muted outline-none caret-transparent select-all"
          />

          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="hover:cursor-pointer active:scale-98 transition-all duration-150"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>

            <Button
              onClick={closeDisplay}
              className="bg-black text-white hover:bg-neutral-800 active:scale-98 transition-all duration-150 hover:cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>

        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisplayApiKeyDialog;
