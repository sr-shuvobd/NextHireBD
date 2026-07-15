'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export interface UserProfile {
  avatar?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role?: 'seeker' | 'recruiter' | 'admin', password?: string) => Promise<'seeker' | 'recruiter' | 'admin' | false>;
  register: (name: string, email: string, role: 'seeker' | 'recruiter' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: UserProfile) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    id: 'user_1',
    name: 'S.R. Shuvo',
    email: 'srs@gmail.com',
    role: 'seeker',
    profile: {
      title: 'Full Stack Engineer',
      bio: 'Passionate TypeScript developer building aesthetic web apps and scalable cloud architectures.',
      skills: ['TypeScript', 'React', 'Next.js', 'Express', 'MongoDB', 'Node.js', 'CSS Modules'],
      resumeUrl: '/mock-resume.pdf',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    }
  },
  {
    id: 'user_2',
    name: 'TechCorp Recruiter',
    email: 'recruiter@techcorp.com',
    role: 'recruiter',
    profile: {
      companyName: 'TechCorp Solutions',
      companyWebsite: 'https://techcorp.example.com',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      bio: 'Leading innovator in AI-powered cloud applications.'
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) {
      setLoading(true);
      return;
    }

    if (session?.user) {
      const u = session.user as any;
      setUser({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'seeker',
        profile: {
          avatar: u.avatar || u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
          companyName: u.companyName || '',
          companyWebsite: u.companyWebsite || '',
          bio: u.bio || '',
          title: u.title || '',
          skills: u.skills ? u.skills.split(',').map((s: string) => s.trim()) : [],
          resumeUrl: u.resumeUrl || ''
        }
      });
      
      // Fetch JWT token from backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) localStorage.setItem('jwt_token', data.token);
      })
      .catch(err => console.error('Error fetching JWT:', err));
      
    } else {
      setUser(null);
      localStorage.removeItem('jwt_token');
    }
    setLoading(false);
  }, [session, isPending]);

  const login = async (email: string, role?: 'seeker' | 'recruiter' | 'admin', password?: string): Promise<'seeker' | 'recruiter' | 'admin' | false> => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password: password || '',
      });
      if (res.data?.user) {
        const u = res.data.user as any;
        return u.role || 'seeker';
      }
    } catch (err) {
      console.error('Better-Auth sign in error:', err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const register = async (name: string, email: string, role: 'seeker' | 'recruiter' | 'admin', password?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        email,
        password: password || 'DefaultPassword123!',
        name,
        role,
      });
      if (res.data?.user) {
        return true;
      }
    } catch (err) {
      console.error('Better-Auth sign up error:', err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('Better-Auth sign out error:', err);
    }
    setUser(null);
    localStorage.removeItem('jwt_token');
    setLoading(false);
  };

  const updateProfile = async (profileData: UserProfile): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await authClient.updateUser({
        name: user.name,
        image: profileData.avatar || user.profile.avatar,
        avatar: profileData.avatar || user.profile.avatar,
        companyName: profileData.companyName !== undefined ? profileData.companyName : user.profile.companyName,
        companyWebsite: profileData.companyWebsite !== undefined ? profileData.companyWebsite : user.profile.companyWebsite,
        bio: profileData.bio !== undefined ? profileData.bio : user.profile.bio,
        title: profileData.title !== undefined ? profileData.title : user.profile.title,
        skills: profileData.skills !== undefined ? profileData.skills.join(',') : user.profile.skills?.join(','),
        resumeUrl: profileData.resumeUrl !== undefined ? profileData.resumeUrl : user.profile.resumeUrl,
      });

      if (!res.error) {
        return true;
      }
    } catch (err) {
      console.error('Better-Auth update profile error:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
