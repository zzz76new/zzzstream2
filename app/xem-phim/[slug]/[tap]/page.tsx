import WatchClient from './WatchClient';

export const dynamic = 'force-static';
export const dynamicParams = false; // Bắt buộc false khi dùng output: 'export'

export async function generateStaticParams() {
  return [{ slug: 'default', tap: 'tap-1' }];
}

export default function Page({ params }: { params: { slug: string; tap: string } }) {
  return <WatchClient params={params} />;
}