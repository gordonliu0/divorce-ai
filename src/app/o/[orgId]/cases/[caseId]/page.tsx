import { CaseDetail } from "@/features/cases/components/case-detail";

interface PageProps {
  params: Promise<{ orgId: string; caseId: string }>;
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { orgId, caseId } = await params;

  return <CaseDetail caseId={caseId} orgId={orgId} />;
}
