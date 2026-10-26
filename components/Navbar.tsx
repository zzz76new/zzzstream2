'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SmartSearch from './SmartSearch';
import { Moon, Sun, Crown } from 'lucide-react';

export default function Navbar() {
  const [userName, setUserName] = useState<string>('Thành viên VIP');
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const logged = localStorage.getItem('vip_user_logged');
    if (logged) {
      try {
        const user = JSON.parse(logged);
        if (user && user.name) setUserName(user.name);
      } catch (e) {
        console.error(e);
      }
    }

    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131313]/95 backdrop-blur-xl border-b border-[#2a2a2a] px-3 sm:px-6 py-2.5 transition-colors duration-300">
      {/* Bố cục Grid 12 Cột cân bằng 25% - 50% - 25% */}
      <div className="grid grid-cols-12 items-center w-full max-w-7xl mx-auto gap-2">
        
        {/* BÊN TRÁI (25%): Chỉ hiển thị chữ "Design by Van Tin" (Đã gỡ Logo S & STREAMX) */}
        <div className="col-span-3 flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#1c1b1b] border border-[#353534] hover:border-[#e10111] active:scale-95 transition-all group shrink-0"
          >
            <span className="text-[10px] sm:text-xs font-medium italic text-[#ffb4aa] tracking-tight group-hover:text-white transition-colors truncate">
              Design by <span className="font-bold not-italic text-white">Van Tin</span>
            </span>
          </Link>
        </div>

        {/* CHÍNH GIỮA (50%): Thanh Tìm Kiếm Căn Giữa Tuyệt Đối */}
        <div className="col-span-6 flex justify-center w-full">
          <SmartSearch />
        </div>

        {/* BÊN PHẢI (25%): Chế độ Sáng/Tối + Account VIP */}
        <div className="col-span-3 flex items-center justify-end gap-1.5 sm:gap-3">
          {/* Nút Light / Dark Mode */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
            className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-white hover:bg-[#1c1b1b] active:scale-95 transition-all border border-transparent hover:border-[#353534] shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            )}
          </button>

          {/* Account Badge & PREMIUM 7 Sắc Cầu Vồng */}
          <div className="relative flex items-center gap-1.5 p-1 sm:p-1.5 sm:pr-3 rounded-full bg-[#1c1b1b] border border-[#353534] shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs shadow-md shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            
            <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[60px] sm:max-w-[85px] hidden md:inline">
              {userName}
            </span>

            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.3)] shrink-0">
              <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 fill-yellow-300" />
              <span>PREMIUM</span>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}