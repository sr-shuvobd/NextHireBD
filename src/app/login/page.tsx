'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Sparkles } from 'lucide-react';
import styles from '../auth.module.css';

function LoginContent() {
  const searchParams = useSearchParams();

  // Read initial role or pre-fill seeker
  const initialRole = (searchParams.get('role') as 'seeker' | 'recruiter' | 'admin') || 'seeker';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'seeker' | 'recruiter' | 'admin'>(initialRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static UI only: Submit logic to be implemented later with backend
    console.log('Login submitted for:', email, role);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div style={{ display: 'inline-flex', padding: 8, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 50, color: 'var(--accent-purple)', marginBottom: 12 }}>
            <Sparkles size={20} />
          </div>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to continue to NextHireBD</p>
        </div>

        {/* Role Selector Tabs */}
        <div className={styles.roleSelector}>
          <button 
            type="button" 
            className={role === 'seeker' ? `${styles.roleBtn} ${styles.activeRole}` : styles.roleBtn}
            onClick={() => setRole('seeker')}
          >
            Job Seeker
          </button>
          <button 
            type="button" 
            className={role === 'recruiter' ? `${styles.roleBtn} ${styles.activeRole}` : styles.roleBtn}
            onClick={() => setRole('recruiter')}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <button type="button" className={styles.googleBtn}>
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link href={`/register?role=${role}`} className={styles.footerLink}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <span>Loading Login Screen...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
