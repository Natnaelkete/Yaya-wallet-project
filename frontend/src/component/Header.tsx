type HeaderProps = {
  q: string;
  setQ: (q: string) => void;
  setPage: (p: number) => void;
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
};

export default function Header({
  q,
  setQ,
  setPage,
  dark,
  setDark,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-950/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">YaYa Transactions</h1>
        <div className="flex gap-2 items-center">
          <input
            className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none"
            placeholder="Search sender / receiver / cause / ID"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
          <button
            onClick={() => setDark((d) => !d)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
