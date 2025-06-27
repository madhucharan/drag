import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ApiKeyDisplay = ({ keyValue, copied, onCopy }) => {
  return (
    <div className="relative rounded-md bg-muted outline-none">
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
        value={keyValue}
        className="font-mono text-sm pr-10 w-full bg-muted outline-none caret-transparent select-all"
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
