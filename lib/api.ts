export async function getMovies(type: string = 'phim-moi-cap-nhat', page: number = 1) {
  try {
    let url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
    
    if (type === 'phim-bo') {
      url = `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${page}`;
    } else if (type === 'phim-le') {
      url = `https://phimapi.com/v1/api/danh-sach/phim-le?page=${page}`;
    } else if (type && type !== 'phim-moi-cap-nhat') {
      url = `https://phimapi.com/v1/api/danh-sach/${type}?page=${page}`;
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];

    const json = await res.json();
    return json.items || json.data?.items || [];
  } catch (err) {
    console.error('Lỗi lấy danh sách phim từ API:', err);
    return [];
  }
}