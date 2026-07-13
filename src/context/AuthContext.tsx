'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, role: 'seeker' | 'recruiter' | 'admin') => Promise<boolean>;
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

  useEffect(() => {
    // Check if user is logged in via localStorage
    const savedUser = localStorage.getItem('nexthire_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('nexthire_user');
      }
    } else {
      // Seed default user for easy testing
      localStorage.setItem('nexthire_registered_users', JSON.stringify(DEFAULT_USERS));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: 'seeker' | 'recruiter' | 'admin'): Promise<boolean> => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredUsers = JSON.parse(
      localStorage.getItem('nexthire_registered_users') || JSON.stringify(DEFAULT_USERS)
    ) as User[];

    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('nexthire_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }

    // If user is not found, automatically register them as a convenience for smooth mock demo
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      profile: {
        skills: [],
        bio: '',
        title: ''
      }
    };
    const updatedList = [...registeredUsers, newUser];
    localStorage.setItem('nexthire_registered_users', JSON.stringify(updatedList));
    setUser(newUser);
    localStorage.setItem('nexthire_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const register = async (name: string, email: string, role: 'seeker' | 'recruiter' | 'admin'): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredUsers = JSON.parse(
      localStorage.getItem('nexthire_registered_users') || JSON.stringify(DEFAULT_USERS)
    ) as User[];

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (exists) {
      setLoading(false);
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      profile: {
        skills: [],
        bio: '',
        title: '',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      }
    };

    const updatedList = [...registeredUsers, newUser];
    localStorage.setItem('nexthire_registered_users', JSON.stringify(updatedList));
    setUser(newUser);
    localStorage.setItem('nexthire_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexthire_user');
  };

  const updateProfile = async (profileData: UserProfile): Promise<boolean> => {
    if (!user) return false;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    };

    setUser(updatedUser);
    localStorage.setItem('nexthire_user', JSON.stringify(updatedUser));

    // Update in list
    const registeredUsers = JSON.parse(
      localStorage.getItem('nexthire_registered_users') || JSON.stringify(DEFAULT_USERS)
    ) as User[];

    const index = registeredUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      registeredUsers[index] = updatedUser;
      localStorage.setItem('nexthire_registered_users', JSON.stringify(registeredUsers));
    }

    return true;
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
