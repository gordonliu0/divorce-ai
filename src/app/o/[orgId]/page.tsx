import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { orgId } = await params;
  redirect(`/o/${orgId}/cases`);
}
