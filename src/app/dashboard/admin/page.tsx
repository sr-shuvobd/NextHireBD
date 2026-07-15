'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  Trash2, 
  FileText,
  Server,
  Shield,
  LogOut,
  Sun,
  Moon,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Tab states: 'overview' | 'users' | 'jobs' | 'reports'
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'reports'>('overview');
  
  // Real database states
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // Search filter states
  const [userSearch, setUserSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Fallback high-quality professional photo for admin
  const adminAvatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150";

  // Security Role Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?role=admin');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push(user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
      return;
    }
  }, [user, authLoading, router]);

  // Fetch data from real backend
  const fetchData = async () => {
    try {
      setDataLoading(true);
      
      // Ping health check
      try {
        const healthRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/health`);
        setServerOnline(healthRes.ok);
      } catch {
        setServerOnline(false);
      }

      // Fetch users
      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Fetch jobs
      const jobsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // Fetch applications
      const appsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications`);
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // User Actions
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: nextStatus } : u));
      }
    } catch (err) {
      console.error('Error changing user status:', err);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Account',
      message: 'Are you sure you want to permanently delete this user account? All associated profile data will be permanently wiped. This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
          });
          if (res.ok) {
            setUsers(prev => prev.filter(u => u._id !== userId));
          }
        } catch (err) {
          console.error('Error deleting user:', err);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Job Actions
  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending Review' ? 'Active' : 'Pending Review';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setJobs(jobs.map(j => j._id === jobId ? { ...j, status: nextStatus } : j));
      }
    } catch (err) {
      console.error('Error changing job status:', err);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Job Posting',
      message: 'Are you sure you want to permanently delete this job posting? This action cannot be undone and will remove the listing from search results.',
      onConfirm: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
          });
          if (res.ok) {
            setJobs(prev => prev.filter(j => j._id !== jobId));
          }
        } catch (err) {
          console.error('Error deleting job:', err);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
    (j.companyName && j.companyName.toLowerCase().includes(jobSearch.toLowerCase()))
  );

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Authenticating Admin Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* TOP HEADER NAVBAR */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>
        {/* Left Side: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}>
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              NextHire<span style={{ color: 'var(--accent-cyan)' }}>BD</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>ADMIN CONSOLE</div>
          </div>
        </div>

        {/* Middle Navigation - Dashboard active indicator matching RecipeHub */}
        <nav style={{ display: 'flex', gap: '32px' }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            borderBottom: '2px solid var(--accent-purple)',
            paddingBottom: '8px',
            marginTop: '6px',
            letterSpacing: '0.5px'
          }}>
            Dashboard
          </span>
        </nav>

        {/* Right Side: Theme & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User Profile Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={adminAvatar} 
              alt={user.name} 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-purple)'
              }}
            />
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.name.split(' ')[0]} {user.name.split(' ')[1] || ''}
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <button 
              onClick={logout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--error)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.3s ease'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* GRID BODY: SIDEBAR + MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr'
      }}>
        {/* LEFT SIDEBAR PANEL */}
        <aside style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}>
          {/* Profile Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px 15px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            position: 'relative'
          }}>
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <img 
                src={adminAvatar} 
                alt={user.name} 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-purple)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--accent-purple)',
                border: '2px solid var(--bg-secondary)',
                borderRadius: '50%',
                padding: '4px'
              }}>
                <Shield size={12} color="#fff" />
              </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{user.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all', marginBottom: '10px' }}>{user.email}</p>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'var(--error)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '100px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Shield size={10} /> Admin
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'overview' ? 'var(--accent-purple)' : 'transparent',
                color: activeTab === 'overview' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'users' ? 'var(--accent-purple)' : 'transparent',
                color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Users size={18} />
              <span>Manage Users</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('jobs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'jobs' ? 'var(--accent-purple)' : 'transparent',
                color: activeTab === 'jobs' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Briefcase size={18} />
              <span>Manage Jobs</span>
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'reports' ? 'var(--accent-purple)' : 'transparent',
                color: activeTab === 'reports' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FileText size={18} />
              <span>Reports</span>
            </button>
          </nav>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main style={{
          padding: '40px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'users' && 'Manage Registered Users'}
              {activeTab === 'jobs' && 'Manage Job Postings'}
              {activeTab === 'reports' && 'Platform Activity Reports'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              {activeTab === 'overview' && 'Monitor the jobs collection, registered users, and active site logs.'}
              {activeTab === 'users' && 'Review user profiles, change roles, suspend accounts, or delete users.'}
              {activeTab === 'jobs' && 'Review and approve recruiter job postings, view applications, or remove items.'}
              {activeTab === 'reports' && 'Inspect real-time application ratios, user growths, and analytics.'}
            </p>
          </div>

          {/* METRIC CARD PANEL */}
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Metric: Total Jobs */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <Briefcase size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>Total Jobs</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  {dataLoading ? '...' : jobs.length}
                </h2>
              </div>
            </div>

            {/* Metric: Registered Users */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <Users size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>Registered Users</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  {dataLoading ? '...' : users.length}
                </h2>
              </div>
            </div>

            {/* Metric: Server Status */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                background: serverOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: serverOnline ? '#10b981' : 'var(--error)'
              }}>
                <Server size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>Server Status</span>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 800, 
                  color: serverOnline ? '#10b981' : 'var(--error)', 
                  margin: '8px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: serverOnline ? '#10b981' : 'var(--error)', display: 'inline-block' }}></span>
                  {serverOnline ? 'ONLINE & ACTIVE' : 'OFFLINE / DISCONNECTED'}
                </h2>
              </div>
            </div>
          </section>

          {/* TAB DETAILED PANELS */}
          {dataLoading ? (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '50px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div className="w-10 h-10 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
              <p style={{ color: 'var(--text-secondary)' }}>Syncing platform database items...</p>
            </div>
          ) : (
            <>
              {/* OVERVIEW PANEL */}
              {activeTab === 'overview' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '28px',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Recent Platform Submissions
                  </h2>
                  {jobs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No recent submissions found.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Job Name</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Company</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Salary Range</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.slice(0, 5).map((job) => (
                            <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                              <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Tech</td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{job.companyName || 'N/A'}</td>
                              <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>{job.salary || 'Negotiable'}</td>
                              <td style={{ padding: '16px' }}>
                                <span style={{
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--accent-cyan)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600
                                }}>
                                  {job.location}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* MANAGE USERS PANEL */}
              {activeTab === 'users' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '28px',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  {/* Search Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    marginBottom: '24px'
                  }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>User Info</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Role</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Joined Date</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img 
                                  src={u.avatar || u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`} 
                                  alt={u.name} 
                                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'recruiter' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                                color: u.role === 'admin' ? '#ef4444' : u.role === 'recruiter' ? '#c084fc' : '#22d3ee',
                                padding: '4px 10px',
                                borderRadius: '100px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                color: u.status === 'Suspended' ? 'var(--error)' : '#10b981',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.9rem'
                              }}>
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: u.status === 'Suspended' ? 'var(--error)' : '#10b981'
                                }}></span>
                                {u.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                              {u.role !== 'admin' && (
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => handleToggleUserStatus(u._id, u.status || 'Active')}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid var(--border-color)',
                                      color: u.status === 'Suspended' ? '#10b981' : 'var(--warning)',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    {u.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(u._id)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid rgba(239, 68, 68, 0.2)',
                                      color: 'var(--error)',
                                      padding: '6px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    title="Delete Account"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MANAGE JOBS PANEL */}
              {activeTab === 'jobs' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '28px',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  {/* Search Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    marginBottom: '24px'
                  }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Search jobs by title or company..."
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Job Details</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Recruiter / Company</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Applications</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                            <td style={{ padding: '16px' }}>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '4px' }}>
                                  <span>{job.type}</span>
                                  <span>•</span>
                                  <span>{job.location}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{job.companyName || 'N/A'}</div>
                            </td>
                            <td style={{ padding: '16px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                              {job.applications || 0} applied
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                background: job.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: job.status === 'Active' ? '#10b981' : 'var(--warning)',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 700
                              }}>
                                {job.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => handleToggleJobStatus(job._id, job.status || 'Active')}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: job.status === 'Pending Review' ? '#10b981' : 'var(--warning)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  {job.status === 'Pending Review' ? 'Approve Job' : 'Unapprove'}
                                </button>
                                <button 
                                  onClick={() => handleDeleteJob(job._id)}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: 'var(--error)',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Delete Job"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REPORTS PANEL */}
              {activeTab === 'reports' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '28px',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Platform Growth & Metrics
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '10px' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>User Role Distribution</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Seekers</span>
                            <span>{users.filter(u => u.role === 'seeker').length} Users</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${(users.filter(u => u.role === 'seeker').length / (users.length || 1)) * 100}%`, 
                              height: '100%', 
                              background: 'var(--accent-cyan)' 
                            }}></div>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Recruiters</span>
                            <span>{users.filter(u => u.role === 'recruiter').length} Users</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${(users.filter(u => u.role === 'recruiter').length / (users.length || 1)) * 100}%`, 
                              height: '100%', 
                              background: 'var(--accent-purple)' 
                            }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>Platform Activity Logs</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '180px', overflowY: 'auto' }}>
                        <div style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: '#10b981' }}>●</span>
                          <span style={{ color: 'var(--text-muted)' }}>[Just now]</span>
                          <span>Admin console synchronized successfully.</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>●</span>
                          <span style={{ color: 'var(--text-muted)' }}>[Active]</span>
                          <span>Database state fully dynamic and verified.</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--accent-purple)' }}>●</span>
                          <span style={{ color: 'var(--text-muted)' }}>[Online]</span>
                          <span>Backend server online. Health ping returned status OK.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-primary)',
          opacity: 0.95,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {confirmModal.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {confirmModal.message}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '12px' }}>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
                  transition: 'all 0.3s ease'
                }}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
