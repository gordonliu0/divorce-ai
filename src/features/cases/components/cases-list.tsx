"use client";

import { Briefcase, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Tables } from "@/database.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CreateCaseDialog } from "./create-case-dialog";

type CaseRow = Tables<"cases"> & { document_count: number };

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  intake: "outline",
  processing: "secondary",
  review: "default",
  complete: "default",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CasesListProps {
  orgId: string;
}

export function CasesList({ orgId }: CasesListProps) {
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch(`/api/o/${orgId}/cases`);
      if (!res.ok) {
        throw new Error("Failed to fetch cases");
      }
      const data = await res.json();
      setCases(data);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Cases</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-medium text-lg">No cases yet</h2>
          <p className="mt-1 mb-4 text-muted-foreground text-sm">
            Create your first case to get started
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </div>
      )}

      {!loading && cases.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead className="text-right">Documents</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow
                  className="cursor-pointer"
                  key={c.id}
                  onClick={() => router.push(`/o/${orgId}/cases/${c.id}`)}
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.client_name}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[c.status] ?? "outline"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.jurisdiction ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {c.document_count}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(c.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateCaseDialog
        onCreated={fetchCases}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        orgId={orgId}
      />
    </div>
  );
}
