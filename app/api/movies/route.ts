import { NextResponse } from 'next/server';

function getItems(payload: any): any[] {
  const candidates = [payload?.items, payload?.data?.items, payload?.data];
  return candidates.find(Array.isArray) ?? [];
}

export async function GET() {
  try {
    const [res1, res2, res3] = await Promise.all([
      fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1', { cache: 'no-store' }),
      fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1', { cache: 'no-store' }),
      fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1', { cache: 'no-store' }),
    ]);

    if (!res1.ok || !res2.ok || !res3.ok) {
      return NextResponse.json(
        { error: 'The movie provider returned an error.' },
        { status: 502 },
      );
    }

    const data1 = await res1.json();
    const data2 = await res2.json();
    const data3 = await res3.json();

    return NextResponse.json({
      newMovies: getItems(data1),
      seriesMovies: getItems(data2),
      singleMovies: getItems(data3),
    });
  } catch (error) {
    console.error('Failed to fetch movie lists:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 502 });
  }
}
