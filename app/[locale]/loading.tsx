function ProductSkeleton() {
  return (
    <article className="grid gap-3">
      <div className="aspect-square rounded-[12px] bg-black/10 dark:bg-white/10" />
      <div className="h-4 w-4/5 rounded-full bg-black/10 dark:bg-white/10" />
      <div className="h-4 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
      <div className="h-6 w-24 rounded-full bg-black/10 dark:bg-white/10" />
    </article>
  );
}

export default function Loading() {
  return (
    <section className="container-page py-8" aria-label="Loading page">
      <div className="animate-pulse">
        <div className="grid gap-8 overflow-hidden rounded-[16px] bg-[var(--background-soft)] p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
          <div className="grid content-center gap-5">
            <div className="h-12 max-w-xl rounded-full bg-black/10 dark:bg-white/10 md:h-16" />
            <div className="grid max-w-lg gap-3">
              <div className="h-4 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-4 w-4/5 rounded-full bg-black/10 dark:bg-white/10" />
            </div>
            <div className="h-12 w-44 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="min-h-[320px] rounded-[12px] bg-black/10 dark:bg-white/10 md:min-h-[420px]" />
        </div>

        <div className="mt-10 h-20 rounded-[12px] bg-black/10 dark:bg-white/10" />

        <div className="mt-14 grid gap-4">
          <div className="mx-auto h-10 w-64 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-5">
            {Array.from({ length: 8 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
