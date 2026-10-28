import MovieDetailClient from './MovieDetailClient';

export const dynamic = 'force-static';
export const dynamicParams = false; // Bắt buộc false khi dùng output: 'export'

export async function generateStaticParams() {
  return [{ slug: 'default' }];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <MovieDetailClient params={params} />;
}