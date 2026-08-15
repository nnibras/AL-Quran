import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Page not found</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Back to Al-Quran
      </Link>
    </div>
  );
}
