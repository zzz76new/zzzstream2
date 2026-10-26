export interface UnifiedEpisode { name: string; slug: string; embed: string; m3u8?: string; }
export interface UnifiedServer { serverName: string; items: UnifiedEpisode[]; }
export interface UnifiedMovie { id: string; name: string; originName: string; slug: string; posterUrl: string; thumbUrl: string; year: number | string; quality: string; lang: string; time?: string; episodeCurrent?: string; category?: string[]; country?: string[]; }
export interface UnifiedMovieDetail extends UnifiedMovie { description: string; director?: string; casts?: string; totalEpisodes?: number; episodes: UnifiedServer[]; }
export interface ApiResponse<T> { success: boolean; data: T; paginate?: { totalItems: number; itemsPerPage: number; currentPage: number; totalPages: number; }; }
