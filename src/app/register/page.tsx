'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Sparkles, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { authClient } from '@/lib/auth-client';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial role or default to seeker
  const initialRole = (searchParams.get('role') as 'seeker' | 'recruiter' | 'admin') || 'seeker';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'seeker' | 'recruiter' | 'admin'>(initialRole);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate password contains at least one letter and one number
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must contain both letters and numbers.');
      setIsSubmitting(false);
      return;
    }

    try {
      let uploadedPicUrl = null;

      // Upload image to ImgBB if selected
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('image', profilePicFile);
        
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=4983d5f47f26efc3e85064efe6b1a73c`, {
          method: 'POST',
          body: formData,
        });
        
        const imgbbData = await imgbbRes.json();
        if (imgbbData.success) {
          uploadedPicUrl = imgbbData.data.url;
        } else {
          toast.error('Image upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      // Register user using Better Auth
      const signupRes = await authClient.signUp.email({
        email,
        password,
        name,
        image: uploadedPicUrl || undefined,
        role,
        avatar: uploadedPicUrl || undefined,
      });

      if (signupRes.data?.user) {
        toast.success('Registration successful! Please log in.');
        router.push(`/login?role=${role}`);
      } else {
        toast.error(signupRes.error?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10 w-full">
      <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-10 max-w-[480px] w-full shadow-[var(--shadow-glass)] flex flex-col gap-6">
        <div className="text-center">
          <div style={{ display: 'inline-flex', padding: 8, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 50, color: 'var(--accent-cyan)', marginBottom: 12 }}>
            <Sparkles size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Get Started</h2>
          <p className="text-[var(--text-secondary)] text-[0.95rem]">Create your profile to join NextHireBD</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-white/[0.03] p-1 rounded-[var(--border-radius-sm)] border border-[var(--border-color)]">
          <button 
            type="button" 
            className={`p-2.5 rounded-[6px] text-[0.9rem] font-semibold cursor-pointer text-center transition-all duration-300 ${role === 'seeker' ? 'bg-[var(--accent-purple)] text-white shadow-[0_4px_12px_var(--accent-purple-glow)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setRole('seeker')}
          >
            Job Seeker
          </button>
          <button 
            type="button" 
            className={`p-2.5 rounded-[6px] text-[0.9rem] font-semibold cursor-pointer text-center transition-all duration-300 ${role === 'recruiter' ? 'bg-[var(--accent-purple)] text-white shadow-[0_4px_12px_var(--accent-purple-glow)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setRole('recruiter')}
          >
            Recruiter
          </button>
        </div>



        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Profile Picture Upload */}
          <div className="flex flex-col gap-2 items-center mb-2">
            <label htmlFor="profilePic" className="w-[90px] h-[90px] rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 bg-white/[0.02] hover:border-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/5">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[var(--text-muted)] text-[0.75rem]">
                  <UploadCloud size={24} />
                  <span>Photo</span>
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="profilePic" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Full Name</label>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] px-3.5 py-3 transition-all duration-300 focus-within:border-[var(--accent-purple)] focus-within:bg-white/[0.04]">
              <User size={18} className="text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full text-[var(--text-primary)] text-[0.95rem] bg-transparent border-none outline-none placeholder-[var(--text-muted)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Min 8 characters" 
                className="w-full text-[var(--text-primary)] text-[0.95rem] bg-transparent border-none outline-none placeholder-[var(--text-muted)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>

          <button type="submit" className="bg-gradient-to-r from-[var(--accent-purple)] to-[#7c3aed] text-white p-3.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] disabled:bg-[var(--text-muted)] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-300 text-center text-[1rem]" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center text-center my-3 text-[var(--text-muted)] text-[0.85rem] before:content-[''] before:flex-1 before:border-b before:border-[var(--border-color)] before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-[var(--border-color)] after:ml-3">
          <span>or continue with</span>
        </div>

        <button type="button" className="flex items-center justify-center gap-3 w-full p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] text-[var(--text-primary)] font-semibold text-[0.95rem] cursor-pointer hover:bg-white/[0.05] hover:border-[var(--border-color-hover)] transition-all duration-300 mb-4">
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-[var(--text-secondary)] text-[0.9rem] mt-2">
          Already have an account?{' '}
          <Link href={`/login?role=${role}`} className="text-[var(--accent-cyan)] font-semibold hover:underline hover:text-[var(--accent-cyan-hover)]">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <span>Loading Register Screen...</span>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
