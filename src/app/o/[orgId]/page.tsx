interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { orgId } = await params;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <h1 className="font-medium text-lg">Dashboard</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Organization: {orgId}
      </p>
    </div>
  );
}
