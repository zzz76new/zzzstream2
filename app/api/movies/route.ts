import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [res1, res2, res3] = await Promise.all([
      fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1', { cache: 'no-store' }),
      fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1', { cache: 'no-store' }),
      fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1', { cache: 'no-store' }),
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();
    const data3 = await res3.json();

    return NextResponse.json({
      newMovies: data1.items || data1.data?.items || [],
      seriesMovies: data2.items || data2.data?.items || [],
      singleMovies: data3.items || data3.data?.items || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}