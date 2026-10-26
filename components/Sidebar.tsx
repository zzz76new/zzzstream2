'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShieldCheck, Crown, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('Thành viên VIP');

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
  }, []);

  const menuItems = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Tài Khoản', href: '/tai-khoan', icon: User },
    { name: 'Bảo Mật & PIN', href: '/bao-mat', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    localStorage.removeItem('vip_user_logged');
    window.location.reload();
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed top-0 left-0 bg-[#0d0d0c] border-r border-[#2a2a2a] p-5 z-30 justify-between">
      <div className="space-y-6">
        {/* Logo STREAMX */}
        <Link href="/" className="flex items-center space-x-2 px-2">
          <div className="w-9 h-9 rounded-xl bg-[#e10111] flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(225,1,17,0.5)]">
            S
          </div>
          <span className="text-xl font-black text-white tracking-wider">
            STREAM<span className="text-[#e10111]">X</span>
          </span>
        </Link>

        {/* Menu Điều Hướng */}
        <div>
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">
            Menu
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#e10111]/15 text-[#ffb4aa] border border-[#e10111]/40'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1c1b1b]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Card Account VIP PREMIUM 7 Sắc Cầu Vồng */}
      <div className="space-y-3">
        <div className="relative p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#353534] space-y-2 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-pulse">
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>PREMIUM VIP</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="pt-1">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-zinc-400">Quyền truy cập: Không giới hạn</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#e10111]/20 hover:text-[#ffb4aa] text-zinc-400 text-xs font-bold transition border border-zinc-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}