'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Sparkles, UploadCloud } from 'lucide-react';
import styles from '../auth.module.css';

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
  const [errorMsg, setErrorMsg] = useState('');

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
    setErrorMsg('');

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
          throw new Error('Image upload failed');
        }
      }

      // Register user in MongoDB
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          profilePic: uploadedPicUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Optionally save user to context or local storage here
        router.push(role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div style={{ display: 'inline-flex', padding: 8, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 50, color: 'var(--accent-cyan)', marginBottom: 12 }}>
            <Sparkles size={20} />
          </div>
          <h2 className={styles.title}>Get Started</h2>
          <p className={styles.subtitle}>Create your profile to join NextHireBD</p>
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

        {errorMsg && (
          <div className={styles.errorBox}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Profile Picture Upload */}
          <div className={styles.formGroup} style={{ alignItems: 'center', marginBottom: 8 }}>
            <label htmlFor="profilePic" className={styles.avatarUpload}>
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile preview" className={styles.avatarPreview} />
              ) : (
                <div className={styles.avatarPlaceholder}>
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
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="John Doe" 
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Min 6 characters" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link href={`/login?role=${role}`} className={styles.footerLink}>
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
