export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full max-w-sm">
      <h1
        className="font-medium text-2xl tracking-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Something went wrong
      </h1>
      <p className="mt-3 text-sm" style={{ color: "hsl(0 0% 45%)" }}>
        {params?.error
          ? `Error code: ${params.error}`
          : "An unspecified error occurred."}
      </p>
    </div>
  );
}
