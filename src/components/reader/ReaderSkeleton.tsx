export function ReaderSkeleton() {
  return (
    <div className="animate-pulse space-y-8 px-4 py-8 sm:px-8" aria-busy="true" aria-label="Loading surah">
      <div className="mx-auto h-6 w-40 rounded bg-stone-200 dark:bg-stone-800" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 border-b border-stone-100 pb-6 dark:border-stone-800">
          <div className="mx-auto h-8 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="mx-auto h-8 w-2/3 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="mx-auto h-4 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
      ))}
    </div>
  );
}
