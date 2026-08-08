export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 text-center text-gray-900 dark:bg-[#0B1120] dark:text-gray-100">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white/90 px-8 py-12 shadow-xl backdrop-blur dark:bg-white/5">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading…</p>
      </div>
    </div>
  );
}
