export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[var(--bg-deep)] transition-colors duration-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} 蒋运立. All rights reserved.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
