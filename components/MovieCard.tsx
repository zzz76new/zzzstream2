import Link from 'next/link';
import { UnifiedMovie } from '@/types/movie';

export default function MovieCard({ movie }: { movie: UnifiedMovie }) {
  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="group relative flex-none w-36 sm:w-44 rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800/80 hover:scale-105 transition-all duration-300 shadow-md"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img
          src={movie.posterUrl || movie.thumbUrl}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:opacity-80 transition"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[#ff0b3a] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            {movie.quality || 'HD'}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-white truncate group-hover:text-[#ff0b3a] transition">
          {movie.name}
        </h3>
        <p className="text-xs text-zinc-400 truncate">{movie.originName || movie.year}</p>
      </div>
    </Link>
  );
}