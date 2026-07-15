'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loggedInRole = await login(email, undefined, password);
      if (loggedInRole) {
        toast.success('Logged in successfully!');
        router.push(loggedInRole === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
      } else {
        toast.error('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (err) {
      console.error('Google Sign-in Error:', err);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10 w-full">
      <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-10 max-w-[480px] w-full shadow-[var(--shadow-glass)] flex flex-col gap-6">
        <div className="text-center">
          <div style={{ display: 'inline-flex', padding: 8, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 50, color: 'var(--accent-purple)', marginBottom: 12 }}>
            <Sparkles size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Welcome Back</h2>
          <p className="text-[var(--text-secondary)] text-[0.95rem]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Email Address</label>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] px-3.5 py-3 transition-all duration-300 focus-within:border-[var(--accent-purple)] focus-within:bg-white/[0.04]">
              <Mail size={18} className="text-[var(--text-muted)]" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full text-[var(--text-primary)] text-[0.95rem] bg-transparent border-none outline-none placeholder-[var(--text-muted)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Password</label>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] px-3.5 py-3 transition-all duration-300 focus-within:border-[var(--accent-purple)] focus-within:bg-white/[0.04]">
              <Lock size={18} className="text-[var(--text-muted)]" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full text-[var(--text-primary)] text-[0.95rem] bg-transparent border-none outline-none placeholder-[var(--text-muted)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="bg-gradient-to-r from-[var(--accent-purple)] to-[#7c3aed] text-white p-3.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] disabled:bg-[var(--text-muted)] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-300 text-center text-[1rem]" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center text-center my-3 text-[var(--text-muted)] text-[0.85rem] before:content-[''] before:flex-1 before:border-b before:border-[var(--border-color)] before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-[var(--border-color)] after:ml-3">
          <span>or continue with</span>
        </div>

        <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 w-full p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] text-[var(--text-primary)] font-semibold text-[0.95rem] cursor-pointer hover:bg-white/[0.05] hover:border-[var(--border-color-hover)] transition-all duration-300 mb-4">
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-[var(--text-secondary)] text-[0.9rem] mt-2">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[var(--accent-cyan)] font-semibold hover:underline hover:text-[var(--accent-cyan-hover)]">
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
