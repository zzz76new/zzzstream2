import { UnifiedMovie, UnifiedMovieDetail } from '@/types/movie';

const NGUONC_BASE = 'https://phim.nguonc.com/api';

export async function getMovies(
  type: string = 'phim-moi-cap-nhat',
  page: number = 1
): Promise<UnifiedMovie[]> {
  try {
    const url =
      type === 'phim-moi-cap-nhat'
        ? `${NGUONC_BASE}/films/phim-moi-cap-nhat?page=${page}`
        : `${NGUONC_BASE}/films/danh-sach/${type}?page=${page}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];

    const json = await res.json();
    const items = json.items || [];

    return items.map((item: any) => ({
      id: item.slug,
      name: item.name,
      originName: item.original_name || item.origin_name || '',
      slug: item.slug,
      posterUrl: item.poster_url || item.thumb_url || '',
      thumbUrl: item.thumb_url || item.poster_url || '',
      year: item.year || '',
      quality: item.quality || 'HD',
      lang: item.language || item.lang || 'Vietsub',
      time: item.time || '',
      episodeCurrent: item.current_episode || item.episode_current || '',
    }));
  } catch (error) {
    console.error('Lỗi lấy danh sách phim NGUONC:', error);
    return [];
  }
}

export async function getMovieDetail(slug: string): Promise<UnifiedMovieDetail | null> {
  try {
    const res = await fetch(`${NGUONC_BASE}/film/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'success' || !json.movie) return null;

    const movieData = json.movie;

    return {
      id: movieData.slug || slug,
      name: movieData.name || '',
      originName: movieData.original_name || '',
      slug: movieData.slug || slug,
      posterUrl: movieData.poster_url || movieData.thumb_url || '',
      thumbUrl: movieData.thumb_url || movieData.poster_url || '',
      year: movieData.year || '',
      quality: movieData.quality || 'HD',
      lang: movieData.language || 'Vietsub',
      time: movieData.time || '',
      episodeCurrent: movieData.current_episode || '',
      description: movieData.description || movieData.content || '',
      director: movieData.director || '',
      casts: movieData.casts || '',
      episodes: (movieData.episodes || []).map((server: any) => ({
        serverName: server.server_name || 'Vietsub #1',
        items: (server.items || []).map((ep: any) => ({
          name: ep.name,
          slug: ep.slug,
          embed: ep.embed,
        })),
      })),
    };
  } catch (error) {
    console.error('Lỗi lấy chi tiết phim NGUONC:', error);
    return null;
  }
}