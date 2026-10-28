'use client';

import Link from 'next/link';
import { UnifiedMovie } from '@/types/movie';
import { Play } from 'lucide-react';

export default function MovieCard({ movie }: { movie: UnifiedMovie }) {
  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="group relative flex flex-col bg-[#1c1b1b] rounded-2xl overflow-hidden border border-[#2a2a2a] hover:border-[#e10111] transition duration-300 shadow-md hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={movie.posterUrl || movie.thumbUrl}
          alt={movie.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#e10111] flex items-center justify-center text-white shadow-lg shadow-[#e10111]/50 transform scale-75 group-hover:scale-100 transition duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#e10111] text-white rounded-md shadow">
            {movie.quality || 'HD'}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-black/70 text-zinc-200 rounded-md backdrop-blur-md">
            {movie.lang || 'Vietsub'}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-xs font-bold text-white group-hover:text-[#ffb4aa] truncate transition">
          {movie.name}
        </h3>
        <p className="text-[11px] text-zinc-400 truncate">
          {movie.originName || movie.year || '2026'}
        </p>
      </div>
    </Link>
  );
}