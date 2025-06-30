import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

const maskKeyId = (keyId) => {
  if (!keyId.startsWith("drag-sk-")) return keyId;

  const secret = keyId.replace("drag_sk_", "");
  return `drag_sk_...${secret.slice(-3)}`;
};

const ApiKeyTable = ({ apiKeys, onRevoke }) => {
  console.log("apiKeys inside table", apiKeys);
  if (!apiKeys?.length) {
    return <p className="text-sm text-muted-foreground"> No API keys found</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.map((key) => {
          return (
            <TableRow key={key.key_id}>
              <TableCell>{key.key_name || "Untitled"}</TableCell>
              <TableCell className="font-mono text-xs">
                {maskKeyId(key.key_id)}
              </TableCell>
              <TableCell>
                {format(new Date(key.created_at), "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRevoke(key.key_id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ApiKeyTable;
