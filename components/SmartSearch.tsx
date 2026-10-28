'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, Film } from 'lucide-react';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(trimmedQuery)}&page=1`,
          { cache: 'no-store' }
        );
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success') {
            setResults(json.items || []);
          } else {
            setResults([]);
          }
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/tim-kiem?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Bạn muốn thưởng thức phim gì nè!!!"
          className="w-full bg-[#1c1b1b] text-xs sm:text-sm text-white pl-10 pr-9 py-2.5 rounded-full border border-[#353534] focus:outline-none focus:border-[#e10111] transition placeholder:text-zinc-500 font-medium"
        />
        {loading ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e10111] animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1b1b] border border-[#353534] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[380px] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-[#e10111] animate-spin" />
              <span>Đang tìm kiếm phim...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-[#2a2a2a]">
              {results.slice(0, 6).map((item) => (
                <Link
                  key={item.slug}
                  href={`/phim/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-[#2a2a2a] transition group"
                >
                  <img
                    src={item.poster_url || item.thumb_url}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 object-cover rounded-lg border border-[#353534] shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#ffb4aa] truncate transition">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {item.original_name || item.year || 'Đang cập nhật'}
                    </span>
                  </div>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="w-full py-2.5 text-center text-xs font-bold text-[#ffb4aa] bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] transition"
              >
                Xem tất cả kết quả cho "{query}"
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-400">Bấm Enter để tìm tất cả phim khớp với "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}