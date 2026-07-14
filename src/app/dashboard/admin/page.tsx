'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  // Tab states: 'overview' | 'users' | 'jobs'
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs'>('overview');
  
  // Dummy data for Admin
  const stats = {
    totalUsers: 1245,
    totalJobs: 342,
    activeApplications: 890,
  };

  const [users] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'seeker', status: 'Active', joinedAt: '2023-09-10' },
    { id: '2', name: 'TechCorp Solutions', email: 'hr@techcorp.com', role: 'recruiter', status: 'Active', joinedAt: '2023-10-01' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'seeker', status: 'Suspended', joinedAt: '2023-11-15' },
  ]);

  const [jobs] = useState([
    { id: '101', title: 'Senior Frontend Developer', company: 'TechCorp Solutions', status: 'Active', postedAt: '2023-10-15' },
    { id: '102', title: 'Backend Engineer (Node.js)', company: 'DevLabs Inc.', status: 'Pending Review', postedAt: '2023-11-02' },
    { id: '103', title: 'UI/UX Designer', company: 'CreativeFlow', status: 'Closed', postedAt: '2023-09-20' },
  ]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 w-full">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Control Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage users, jobs, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 mt-6 items-start">
        {/* Sidebar Nav */}
        <aside className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'overview' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'users' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <Users size={18} />
            <span>Manage Users</span>
          </button>

          <button 
            onClick={() => setActiveTab('jobs')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'jobs' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <Briefcase size={18} />
            <span>Manage Jobs</span>
          </button>
        </aside>

        {/* Panel Area */}
        <main className="flex flex-col gap-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 shadow-[var(--shadow-glass)] flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users size={64} />
                  </div>
                  <h3 className="text-[var(--text-secondary)] font-semibold">Total Users</h3>
                  <div className="text-4xl font-extrabold text-[var(--text-primary)]">{stats.totalUsers}</div>
                  <div className="text-[0.85rem] text-[var(--success)] flex items-center gap-1 mt-2">
                    <TrendingUp size={14} /> +12% this month
                  </div>
                </div>
                <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 shadow-[var(--shadow-glass)] flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Briefcase size={64} />
                  </div>
                  <h3 className="text-[var(--text-secondary)] font-semibold">Total Jobs</h3>
                  <div className="text-4xl font-extrabold text-[var(--text-primary)]">{stats.totalJobs}</div>
                  <div className="text-[0.85rem] text-[var(--success)] flex items-center gap-1 mt-2">
                    <TrendingUp size={14} /> +5% this month
                  </div>
                </div>
                <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 shadow-[var(--shadow-glass)] flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 size={64} />
                  </div>
                  <h3 className="text-[var(--text-secondary)] font-semibold">Applications</h3>
                  <div className="text-4xl font-extrabold text-[var(--accent-cyan)]">{stats.activeApplications}</div>
                  <div className="text-[0.85rem] text-[var(--success)] flex items-center gap-1 mt-2">
                    <TrendingUp size={14} /> +24% this month
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Platform Activity</h2>
                <div className="text-[var(--text-secondary)] text-[0.95rem] text-center p-10 border border-dashed border-[var(--border-color)] rounded-[var(--border-radius-sm)]">
                  Activity charts and detailed graphs will be integrated here later.
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)] overflow-x-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-3">Manage Users</h2>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-[0.9rem]">
                    <th className="pb-3 font-semibold px-2">Name</th>
                    <th className="pb-3 font-semibold px-2">Role</th>
                    <th className="pb-3 font-semibold px-2">Status</th>
                    <th className="pb-3 font-semibold px-2">Joined</th>
                    <th className="pb-3 font-semibold px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-semibold text-[var(--text-primary)]">{u.name}</div>
                        <div className="text-[0.85rem] text-[var(--text-muted)]">{u.email}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="capitalize text-[0.9rem] bg-white/[0.05] px-2 py-1 rounded text-[var(--text-secondary)]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`text-[0.85rem] font-bold px-2 py-1 rounded-full ${u.status === 'Active' ? 'text-[var(--success)] bg-emerald-500/10' : 'text-[var(--error)] bg-red-500/10'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-[0.9rem] text-[var(--text-secondary)]">{u.joinedAt}</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.status === 'Active' ? (
                            <button className="p-1.5 text-[var(--warning)] hover:bg-amber-500/10 rounded transition-colors" title="Suspend User">
                              <XCircle size={18} />
                            </button>
                          ) : (
                            <button className="p-1.5 text-[var(--success)] hover:bg-emerald-500/10 rounded transition-colors" title="Activate User">
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button className="p-1.5 text-[var(--error)] hover:bg-red-500/10 rounded transition-colors" title="Delete User">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)] overflow-x-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-3">Manage Jobs</h2>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-[0.9rem]">
                    <th className="pb-3 font-semibold px-2">Job Title</th>
                    <th className="pb-3 font-semibold px-2">Company</th>
                    <th className="pb-3 font-semibold px-2">Status</th>
                    <th className="pb-3 font-semibold px-2">Posted</th>
                    <th className="pb-3 font-semibold px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-semibold text-[var(--text-primary)]">{job.title}</div>
                      </td>
                      <td className="py-4 px-2 text-[0.9rem] text-[var(--text-secondary)]">
                        {job.company}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`text-[0.85rem] font-bold px-2 py-1 rounded-full ${
                          job.status === 'Active' ? 'text-[var(--success)] bg-emerald-500/10' : 
                          job.status === 'Pending Review' ? 'text-[var(--warning)] bg-amber-500/10' : 
                          'text-[var(--text-muted)] bg-slate-500/10'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-[0.9rem] text-[var(--text-secondary)]">{job.postedAt}</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === 'Pending Review' && (
                            <button className="p-1.5 text-[var(--success)] hover:bg-emerald-500/10 rounded transition-colors" title="Approve Job">
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button className="p-1.5 text-[var(--error)] hover:bg-red-500/10 rounded transition-colors" title="Delete Job">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
