'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Briefcase size={28} color="#8b5cf6" />
          <span>NextHire<span style={{ color: '#06b6d4' }}>BD</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <Link href="/" className={isActive('/') ? `${styles.link} ${styles.activeLink}` : styles.link}>
            Home
          </Link>
          <Link href="/jobs" className={isActive('/jobs') ? `${styles.link} ${styles.activeLink}` : styles.link}>
            Find Jobs
          </Link>
          {user && (
            <Link 
              href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} 
              className={pathname.startsWith('/dashboard') ? `${styles.link} ${styles.activeLink}` : styles.link}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Actions bar (Theme + Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            style={{ 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.02)',
              transition: 'var(--transition-smooth)'
            }}
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            {user ? (
              <div className={styles.userMenu} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img 
                  src={user.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt={user.name} 
                  className={styles.avatar} 
                />
                <span className={styles.username}>{user.name}</span>
                
                {dropdownOpen && (
                  <div className={styles.dropdown} onMouseLeave={() => setDropdownOpen(false)}>
                    <Link href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} className={styles.dropdownItem}>
                      <LayoutDashboard size={16} />
                      <span>My Dashboard</span>
                    </Link>
                    <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={logout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  Sign In
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={styles.menuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/jobs" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
            Find Jobs
          </Link>
          {user && (
            <Link 
              href={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'} 
              className={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className={styles.mobileActions}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img 
                    src={user.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                    alt={user.name} 
                    className={styles.avatar} 
                  />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                </div>
                <button 
                  className={styles.registerBtn} 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn} style={{ textAlign: 'center', display: 'block' }} onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className={styles.registerBtn} style={{ textAlign: 'center', display: 'block' }} onClick={() => setMobileMenuOpen(false)}>
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
