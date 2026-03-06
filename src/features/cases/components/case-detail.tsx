"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Tables } from "@/database.types";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

type CaseRow = Tables<"cases"> & { document_count: number };

function formatDate(dateStr: string | null) {
  if (!dateStr) {
    return "—";
  }
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CaseDetailProps {
  caseId: string;
  orgId: string;
}

export function CaseDetail({ orgId, caseId }: CaseDetailProps) {
  const [caseData, setCaseData] = useState<CaseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/o/${orgId}/cases/${caseId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch case");
        }
        setCaseData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case");
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [orgId, caseId]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <p className="text-destructive">{error ?? "Case not found"}</p>
        <Link
          className="mt-2 text-muted-foreground text-sm underline"
          href={`/o/${orgId}/cases`}
        >
          Back to cases
        </Link>
      </div>
    );
  }

  const details = [
    { label: "Client", value: caseData.client_name },
    { label: "Opposing Party", value: caseData.opposing_party_name ?? "—" },
    { label: "Jurisdiction", value: caseData.jurisdiction ?? "—" },
    { label: "Case Number", value: caseData.case_number ?? "—" },
    { label: "Date of Marriage", value: formatDate(caseData.date_of_marriage) },
    {
      label: "Date of Separation",
      value: formatDate(caseData.date_of_separation),
    },
    { label: "Date of Filing", value: formatDate(caseData.date_of_filing) },
    { label: "Documents", value: String(caseData.document_count) },
    { label: "Created", value: formatDate(caseData.created_at) },
  ];

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <Link
          className="mb-4 inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
          href={`/o/${orgId}/cases`}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to cases
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-2xl">{caseData.name}</h1>
          <Badge>{caseData.status}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="font-medium text-muted-foreground text-sm">
                  {d.label}
                </dt>
                <dd className="mt-1">{d.value}</dd>
              </div>
            ))}
          </dl>
          {caseData.notes && (
            <div className="mt-6">
              <dt className="font-medium text-muted-foreground text-sm">
                Notes
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{caseData.notes}</dd>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
