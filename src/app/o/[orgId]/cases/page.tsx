import { CasesList } from "@/features/cases/components/cases-list";

interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function CasesPage({ params }: PageProps) {
  const { orgId } = await params;

  return <CasesList orgId={orgId} />;
}
