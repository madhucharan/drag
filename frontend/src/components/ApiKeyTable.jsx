import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useApiKeyStore } from "@/store/ApiKeyStore";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiKeyTable = () => {
  const { data: apiKeys, isLoading, isError } = useApiKeys();
  const { openRevoke } = useApiKeyStore();

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading keys...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load API keys.</p>;
  if (!apiKeys || apiKeys.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No API keys created yet.</p>
    );
  }

  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.key_id}>
              <TableCell>{key.key_name || "-"}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {key.key_id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                {format(new Date(key.created_at), "yyyy-MM-dd HH:mm")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openRevoke(key.key_id)}
                  className="text-red-500 hover:bg-red-100 active:scale-98 transition-all duration-150 hover:cursor-pointer rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Revoke</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeyTable;
