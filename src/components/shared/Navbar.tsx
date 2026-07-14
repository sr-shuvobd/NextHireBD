'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) => {
    const base = "text-[var(--text-secondary)] font-medium relative text-[0.95rem] hover:text-[var(--text-primary)] transition-all duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[var(--accent-purple)] after:transition-all after:duration-300 hover:after:w-full";
    return isActive(path) 
      ? `${base} text-[var(--text-primary)] after:w-full` 
      : `${base} after:w-0`;
  };

  return (
    <header className="sticky top-0 left-0 w-full z-[100] bg-[var(--bg-surface)] backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer">
          <Briefcase size={28} color="#8b5cf6" />
          <span>NextHire<span style={{ color: '#06b6d4' }}>BD</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link href="/jobs" className={navLinkClass('/jobs')}>
            Find Jobs
          </Link>
          {user && (
            <Link 
              href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} 
              className={navLinkClass(user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter')}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Actions bar (Theme + Auth) */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="text-[var(--text-secondary)] cursor-pointer p-2 rounded-full flex items-center justify-center border border-[var(--border-color)] bg-[var(--bg-secondary)] transition-all duration-300 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative flex items-center gap-3 cursor-pointer px-3 py-1.5 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--border-color-hover)] hover:bg-[var(--bg-surface-hover)]" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img 
                  src={user.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover bg-[var(--bg-secondary)] border border-[var(--border-color-hover)]" 
                />
                <span className="font-medium text-[0.9rem] text-[var(--text-primary)]">{user.name}</span>
                
                {dropdownOpen && (
                  <div className="absolute top-[110%] right-0 w-[200px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--border-radius-md)] shadow-[var(--shadow-glass)] p-2 flex flex-col gap-1 z-[110]" onMouseLeave={() => setDropdownOpen(false)}>
                    <Link href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} className="p-2.5 rounded-[var(--border-radius-sm)] text-[var(--text-secondary)] text-[0.9rem] transition-all duration-300 flex items-center gap-2 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                      <LayoutDashboard size={16} />
                      <span>My Dashboard</span>
                    </Link>
                    <button className="p-2.5 rounded-[var(--border-radius-sm)] text-[var(--error)] text-[0.9rem] transition-all duration-300 flex items-center gap-2 hover:bg-red-500/10 hover:text-[var(--error)]" onClick={logout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-[var(--text-secondary)] font-semibold px-4 py-2 cursor-pointer transition-all duration-300 hover:text-[var(--text-primary)]">
                  Sign In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-5 py-2.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all duration-300">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="block md:hidden text-[var(--text-primary)] cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[72px] left-0 w-full bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-6 flex flex-col gap-5 z-[99]">
          <Link href="/" className="text-[var(--text-secondary)] font-medium text-[1.1rem] hover:text-[var(--text-primary)]" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/jobs" className="text-[var(--text-secondary)] font-medium text-[1.1rem] hover:text-[var(--text-primary)]" onClick={() => setMobileMenuOpen(false)}>
            Find Jobs
          </Link>
          {user && (
            <Link 
              href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} 
              className="text-[var(--text-secondary)] font-medium text-[1.1rem] hover:text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className="flex flex-col gap-3 mt-3 border-t border-[var(--border-color)] pt-5">
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img 
                    src={user.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover bg-[var(--bg-secondary)] border border-[var(--border-color-hover)]" 
                  />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                </div>
                <button 
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-5 py-2.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all duration-300" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[var(--text-secondary)] font-semibold px-4 py-2 cursor-pointer transition-all duration-300 hover:text-[var(--text-primary)] text-center block" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-5 py-2.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all duration-300 text-center block" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
