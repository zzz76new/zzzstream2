'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WatchPage({ params }: { params: Promise<{ slug: string; tap: string }> }) {
  const { slug, tap } = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(true);
  const [likeCount, setLikeCount] = useState(3482);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [searchEp, setSearchEp] = useState('');

  useEffect(() => {
    async function fetchWatchData() {
      try {
        setLoading(true);
        const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === 'success' && data.movie) {
          const movieObj = data.movie;
          setMovie(movieObj);

          let foundEmbed = '';
          if (movieObj.episodes) {
            for (const server of movieObj.episodes) {
              const found = (server.items || []).find(
                (item: any) => item.slug === tap || item.name === tap
              );
              if (found) {
                foundEmbed = found.embed;
                break;
              }
            }
            if (!foundEmbed && movieObj.episodes[0]?.items?.[0]) {
              foundEmbed = movieObj.episodes[0].items[0].embed;
            }
          }
          setEmbedUrl(foundEmbed);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu phim:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWatchData();
  }, [slug, tap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e10111] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const episodesList = movie?.episodes?.[0]?.items || [];

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans">
      {/* Top Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="h-14 px-4 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2a2a2a] transition"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-bold text-base truncate max-w-[200px] sm:max-w-xs">
              {movie?.name || 'Chi Tiết Phim'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2a2a2a] transition">
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#ffb3af] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#68000e] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 pt-14 pb-10 max-w-5xl w-full mx-auto">
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-[#0e0e0e] shadow-2xl overflow-hidden">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={movie?.name || 'Trình phát phim'}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
              Chưa có nguồn phát cho tập này.
            </div>
          )}
        </div>

        {/* Metadata Header */}
        <div className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                {movie?.name}
              </h2>
              <span className="text-sm text-[#ffb4aa] font-semibold">Tập {tap}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#2a2a2a] shrink-0 mt-0.5">
              <span
                className="material-symbols-outlined text-[#e10111] text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-sm font-bold">8.7</span>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-[#e10111]/20 text-[#ffb4aa] font-bold">
              {movie?.quality || 'HD'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2a2a2a] text-[#c6c6cf] font-semibold">
              {movie?.language || 'Vietsub'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2a2a2a] text-[#c6c6cf]">
              {movie?.year || '2025'}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button className="min-w-[76px] h-12 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1c1b1b] hover:bg-[#201f1f] active:scale-95 transition">
            <span className="material-symbols-outlined text-[20px] text-[#ffb4aa]">bookmark_add</span>
            <span className="text-[11px] font-medium text-zinc-300">Danh sách</span>
          </button>
          <button
            onClick={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            className="min-w-[76px] h-12 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1c1b1b] hover:bg-[#201f1f] active:scale-95 transition"
          >
            <span
              className="material-symbols-outlined text-[20px] text-[#e10111]"
              style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            <span className="text-[11px] font-medium text-zinc-300">
              {likeCount.toLocaleString()}
            </span>
          </button>
          <button className="min-w-[76px] h-12 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1c1b1b] hover:bg-[#201f1f] active:scale-95 transition">
            <span className="material-symbols-outlined text-[20px] text-[#c6c6cf]">download</span>
            <span className="text-[11px] font-medium text-zinc-300">Tải về</span>
          </button>
          <button className="min-w-[76px] h-12 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1c1b1b] hover:bg-[#201f1f] active:scale-95 transition">
            <span className="material-symbols-outlined text-[20px] text-[#c6c6cf]">share</span>
            <span className="text-[11px] font-medium text-zinc-300">Chia sẻ</span>
          </button>
        </div>

        {/* Collapsible Synopsis Card */}
        <div className="mx-4 p-3.5 rounded-2xl bg-[#1c1b1b] flex flex-col gap-2.5">
          <div
            onClick={() => setSynopsisExpanded(!synopsisExpanded)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="text-sm font-bold">Tóm tắt nội dung</span>
            <span
              className="material-symbols-outlined text-[#c6c6cf] transition-transform duration-200"
              style={{ transform: synopsisExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
          </div>
          <p
            className={`text-xs text-[#c6c6cf] leading-relaxed transition-all duration-300 ${
              synopsisExpanded ? '' : 'line-clamp-2'
            }`}
          >
            {movie?.description || 'Đang cập nhật nội dung phim...'}
          </p>
        </div>

        {/* Source Servers */}
        {movie?.episodes && movie.episodes.length > 0 && (
          <div className="px-4 pt-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4aa] text-[20px]">dns</span>
                <h3 className="text-sm font-bold uppercase tracking-wide">Nguồn phát (Servers)</h3>
              </div>
              <span className="text-[11px] text-[#c6c6cf]">Tự động chuyển khi lag</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {movie.episodes.map((server: any, idx: number) => (
                <button
                  key={idx}
                  className="relative flex items-center gap-2.5 p-3 rounded-xl bg-[#2a2a2a] text-left active:scale-95 transition overflow-hidden shadow-[0_0_12px_rgba(225,1,17,0.25)]"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e10111]"></div>
                  <div className="w-8 h-8 rounded-lg bg-[#e10111]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#ffb4aa] text-[18px]">bolt</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#ffb4aa] truncate">
                      {server.server_name || `Server #${idx + 1}`}
                    </span>
                    <span className="text-[11px] text-[#e7bcba] truncate">Vietsub (Mặc định)</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode Selector Grid */}
        <div className="px-4 pt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4aa] text-[20px]">
                video_library
              </span>
              <h3 className="text-base font-bold">Danh sách tập</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1b1b]">
              <span className="material-symbols-outlined text-[#c6c6cf] text-[16px]">search</span>
              <input
                className="w-12 bg-transparent text-sm outline-none text-center text-white placeholder:text-[#c6c6cf]"
                placeholder="Tập..."
                type="text"
                value={searchEp}
                onChange={(e) => setSearchEp(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {episodesList
              .filter((ep: any) => (searchEp ? ep.name.includes(searchEp) : true))
              .map((ep: any) => {
                const isActive = ep.slug === tap || ep.name === tap;
                return (
                  <Link
                    key={ep.slug}
                    href={`/xem-phim/${slug}/${ep.slug}`}
                    className={`h-12 rounded-xl text-base font-bold flex items-center justify-center gap-1 active:scale-95 transition-all ${
                      isActive
                        ? 'bg-[#e10111] text-white shadow-[0_0_16px_rgba(225,1,17,0.4)]'
                        : 'bg-[#1c1b1b] hover:bg-[#201f1f] text-white'
                    }`}
                  >
                    <span>{ep.name}</span>
                    {isActive && (
                      <span className="material-symbols-outlined text-[18px] animate-pulse">
                        equalizer
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}