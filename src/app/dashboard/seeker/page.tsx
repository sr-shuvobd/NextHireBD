'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Briefcase, FileText, CheckCircle2, Save, X, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getApplications, Application } from '@/services/mockData';

export default function SeekerDashboard() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  
  // Tab states: 'profile' | 'applications'
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('applications');
  
  // Profile Form States
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?role=seeker');
      return;
    }

    if (user) {
      // Security role check: redirect if not seeker
      if (user.role !== 'seeker') {
        router.push(user.role === 'recruiter' ? '/dashboard/recruiter' : '/');
        return;
      }

      setTimeout(() => {
        setName(user.name);
        setTitle(user.profile.title || '');
        setBio(user.profile.bio || '');
        setSkills(user.profile.skills || []);
        setResumeUrl(user.profile.resumeUrl || '');
        setAvatar(user.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`);

        // Load applications
        const allApps = getApplications();
        const seekerApps = allApps.filter(app => app.seekerId === user.id);
        setApplications(seekerApps);
      }, 0);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <span>Verifying authentication details...</span>
      </div>
    );
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateProfile({
      title,
      bio,
      skills,
      resumeUrl,
      avatar
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-slate-500/10 border border-slate-500/20 text-[var(--text-secondary)]';
      case 'reviewing': return 'bg-amber-500/10 border border-amber-500/20 text-[var(--warning)]';
      case 'shortlisted': return 'bg-cyan-500/10 border border-cyan-500/20 text-[var(--accent-cyan)]';
      case 'rejected': return 'bg-red-500/10 border border-red-500/20 text-[var(--error)]';
      case 'accepted': return 'bg-emerald-500/10 border border-emerald-500/20 text-[var(--success)]';
      default: return 'bg-slate-500/10 border border-slate-500/20 text-[var(--text-secondary)]';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 w-full">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.profile.title || 'Job Seeker'} • Candidate Portal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 mt-6 items-start">
        {/* Sidebar Nav */}
        <aside className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('applications')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'applications' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <Briefcase size={18} />
            <span>My Applications</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'profile' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <UserIcon size={18} />
            <span>My Profile</span>
          </button>
        </aside>

        {/* Panel Area */}
        <main className="flex flex-col gap-6">
          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-3">Application History</h2>
              
              {applications.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white/[0.01] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[var(--border-color-hover)] hover:bg-white/[0.02] transition-all duration-300">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[1.15rem] font-bold text-[var(--text-primary)]">{app.jobTitle}</div>
                        <div className="text-[0.95rem] text-[var(--text-secondary)]">{app.companyName}</div>
                        <div className="text-[0.85rem] text-[var(--text-muted)]">
                          Applied on: {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <span className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
                  <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div>You haven&apos;t submitted any job applications yet.</div>
                  <button onClick={() => router.push('/jobs')} className="accent-btn" style={{ marginTop: 16 }}>
                    Browse Available Jobs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-3">Profile Configuration</h2>

              {saveSuccess && (
                <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 8, color: 'var(--success)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} />
                  Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-8">
                {/* Left Column: Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <img src={avatar} alt={name} className="w-[120px] h-[120px] rounded-full object-cover border-2 border-[var(--accent-purple)] bg-[var(--bg-secondary)]" />
                  <span className="text-[0.8rem] text-[var(--accent-cyan)] cursor-pointer font-semibold" onClick={() => {
                    const newAvatar = prompt('Enter a valid image URL for avatar:', avatar);
                    if (newAvatar) setAvatar(newAvatar);
                  }}>
                    Change Photo
                  </span>
                </div>

                {/* Right Column: Form */}
                <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                        disabled // Disabled name edit for security
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Professional Title</label>
                      <input 
                        type="text" 
                        value={title} 
                        placeholder="e.g. Senior Frontend Developer"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Professional Bio</label>
                    <textarea 
                      value={bio} 
                      placeholder="Write a short summary about your accomplishments..."
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full min-h-[100px] px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] resize-y transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Resume PDF Link</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input 
                        type="text" 
                        value={resumeUrl} 
                        placeholder="e.g. https://yourcv.example.com/resume.pdf"
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                        required
                      />
                    </div>
                  </div>

                  {/* Skills Tag Management */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Skills / Technologies</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input 
                        type="text" 
                        placeholder="Type a skill (e.g. React) and click Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                      />
                      <button type="button" onClick={handleAddSkill} className="outline-btn" style={{ padding: '0 16px' }}>
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {skills.map((skill, index) => (
                        <span key={index} className="bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 px-3 py-1.5 rounded-full text-[0.8rem] font-medium text-violet-400 inline-flex items-center gap-1.5">
                          {skill}
                          <X size={14} className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--error)]" onClick={() => handleRemoveSkill(skill)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="accent-btn" 
                    style={{ alignSelf: 'flex-start', marginTop: 12 }}
                    disabled={isSaving}
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving Changes...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
