'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import VipAuthModal from '@/components/VipAuthModal';
import Link from 'next/link';
import { Loader2, ArrowLeft, Tv, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WatchClient({ params }: { params?: any }) {
  const [movie, setMovie] = useState<any>(null);
  const [currentEp, setCurrentEp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [useBackup, setUseBackup] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  useEffect(() => {
    let currentSlug = params?.slug;
    let currentTap = params?.tap;

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/xem-phim\/([^\/]+)\/([^\/]+)/);
      if (match) {
        currentSlug = match[1].replace('.html', '').replace(/\/$/, '');
        currentTap = match[2].replace('.html', '').replace(/\/$/, '');
      }
    }

    if (!currentSlug || currentSlug === 'default') {
      setLoading(false);
      return;
    }

    async function fetchWatchData() {
      try {
        setLoading(true);
        setUseBackup(false);
        const res = await fetch(`https://phimapi.com/phim/${currentSlug}`, { cache: 'no-store' });
        if (!res.ok) return;

        const data = await res.json();
        if (data.status && data.movie) {
          setMovie({
            ...data.movie,
            episodes: data.episodes || [],
          });

          const servers = data.episodes || [];
          let foundEp: any = null;

          for (const server of servers) {
            const matchEp = (server.server_data || []).find(
              (item: any) => item.slug === currentTap || item.name === currentTap
            );
            if (matchEp) {
              foundEp = matchEp;
              break;
            }
          }

          if (!foundEp && servers[0]?.server_data?.[0]) {
            foundEp = servers[0].server_data[0];
          }

          setCurrentEp(foundEp);
        }
      } catch (err) {
        console.error('Lỗi lấy dữ liệu phát phim từ KKPhim:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-[#e10111] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-xs text-zinc-400">Đang nạp nguồn phát KKPhim...</p>
      </div>
    );
  }

  if (!movie || !currentEp) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-400 text-lg">Không tìm thấy nguồn phát cho tập phim này!</p>
        <Link href="/" className="px-5 py-2 bg-[#e10111] text-white font-bold rounded-xl text-sm">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  const embedUrl = currentEp.link_embed || currentEp.embed;
  const m3u8Url = currentEp.link_m3u8 || currentEp.m3u8;

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
          <Link
            href={`/phim/${movie.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại chi tiết phim</span>
          </Link>

          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-2xl">
            {!useBackup && embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                referrerPolicy="no-referrer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : m3u8Url ? (
              <video
                src={m3u8Url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3 p-4 text-center">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
                <p className="text-sm font-bold text-zinc-300">
                  Cần mở trình chiếu tab mới để phát video này!
                </p>
                {embedUrl && (
                  <a
                    href={embedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#e10111] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Xem Phim Trên Tab Mới</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1c1b1b] p-4 rounded-2xl border border-[#353534]">
            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{movie.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#e10111] text-white font-bold">
                  {currentEp.name}
                </span>
              </h1>
              <p className="text-xs text-zinc-400">{movie.origin_name || movie.original_name}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowVipModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Thực VIP</span>
              </button>

              <button
                onClick={() => setUseBackup(!useBackup)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#e10111]" />
                <span>{useBackup ? 'Dùng Nguồn Iframe' : 'Đổi Nguồn Trực Tiếp'}</span>
              </button>
            </div>
          </div>

          {movie.episodes && movie.episodes.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#e10111]" /> Chọn Tập Phim
              </h3>

              {movie.episodes.map((server: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs text-zinc-500 font-semibold">{server.server_name}</p>
                  <div className="flex flex-wrap gap-2">
                    {(server.server_data || []).map((ep: any) => {
                      const isActive = ep.slug === currentEp.slug;
                      return (
                        <Link
                          key={ep.slug}
                          href={`/xem-phim/${movie.slug}/${ep.slug}`}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#e10111] text-white shadow-lg shadow-[#e10111]/30'
                              : 'bg-[#1c1b1b] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-[#353534]'
                          }`}
                        >
                          {ep.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />

      {/* TÍCH HỢP MODAL VIP Ở ĐÂY, ĐÃ FIX LỖI TẮT MODAL */}
      {showVipModal && <VipAuthModal />}
    </div>
  );
}