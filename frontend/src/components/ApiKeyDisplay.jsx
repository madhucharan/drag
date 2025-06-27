import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiKeyDisplay = ({ keyValue, copied, onCopy }) => {
  return (
    <div className="relative rounded-md border bg-muted px-3 py-2 overflow-x-auto">
      <input
        readOnly
        type="text"
        value={keyValue}
        className="font-mono text-sm pr-10 w-full bg-muted outline-none overflow-x-auto"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default ApiKeyDisplay;
