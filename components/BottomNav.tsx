'use client';

import Link from 'next/link';
import { Home, Search, Bookmark, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-t border-zinc-800 lg:hidden flex justify-around items-center h-16 px-2">
      <Link href="/" className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-[#ff0b3a]">
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Trang chủ</span>
      </Link>
      <Link href="/tim-kiem" className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-gray-400 hover:text-white">
        <Search className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Tìm kiếm</span>
      </Link>
      <button className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-gray-400 hover:text-white">
        <Bookmark className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Đã lưu</span>
      </button>
      <button className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-gray-400 hover:text-white">
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Cá nhân</span>
      </button>
    </div>
  );
}