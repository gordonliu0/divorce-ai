// Settings routes now redirect to org home — settings is a modal
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function Layout({ params }: LayoutProps) {
  const { orgId } = await params;
  redirect(`/o/${orgId}`);
}
