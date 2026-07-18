import Link from 'next/link';

export function Logo({ scrolled = true, size = 'md' }: { scrolled?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className={`${dim} rounded-xl bg-navy flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 44 L16 20 L24 20 L40 36 L40 20 L48 20 L48 44 L40 44 L24 28 L24 44 Z" fill="#fff"/>
          <path d="M20 38 L28 30 L34 34 L44 22" stroke="#FF3B3B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="44" cy="22" r="3.5" fill="#FF3B3B"/>
        </svg>
      </div>
      <span className={`${text} font-bold tracking-tight ${scrolled ? 'text-navy dark:text-white' : 'text-white'}`}>
        Nova<span className="text-red-brand">Yield</span>
      </span>
    </Link>
  );
}
