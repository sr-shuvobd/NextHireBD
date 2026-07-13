'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Briefcase, FileText, CheckCircle2, Save, X, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getApplications, Application } from '@/services/mockData';
import styles from './seeker.module.css';

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
      case 'applied': return styles.statusApplied;
      case 'reviewing': return styles.statusReviewing;
      case 'shortlisted': return styles.statusShortlisted;
      case 'rejected': return styles.statusRejected;
      case 'accepted': return styles.statusAccepted;
      default: return styles.statusApplied;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.profile.title || 'Job Seeker'} • Candidate Portal
        </p>
      </div>

      <div className={styles.dashboardLayout}>
        {/* Sidebar Nav */}
        <aside className={styles.sidebarMenu}>
          <button 
            onClick={() => setActiveTab('applications')} 
            className={activeTab === 'applications' ? `${styles.menuBtn} ${styles.activeMenuBtn}` : styles.menuBtn}
          >
            <Briefcase size={18} />
            <span>My Applications</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={activeTab === 'profile' ? `${styles.menuBtn} ${styles.activeMenuBtn}` : styles.menuBtn}
          >
            <UserIcon size={18} />
            <span>My Profile</span>
          </button>
        </aside>

        {/* Panel Area */}
        <main className={styles.mainContent}>
          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className={styles.panelCard}>
              <h2 className={styles.panelTitle}>Application History</h2>
              
              {applications.length > 0 ? (
                <div className={styles.appCardList}>
                  {applications.map((app) => (
                    <div key={app.id} className={styles.appCard}>
                      <div className={styles.appInfo}>
                        <div className={styles.appTitle}>{app.jobTitle}</div>
                        <div className={styles.appCompany}>{app.companyName}</div>
                        <div className={styles.appDate}>
                          Applied on: {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <span className={`${styles.statusBadge} ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
                  <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div>You haven't submitted any job applications yet.</div>
                  <button onClick={() => router.push('/jobs')} className="accent-btn" style={{ marginTop: 16 }}>
                    Browse Available Jobs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={styles.panelCard}>
              <h2 className={styles.panelTitle}>Profile Configuration</h2>

              {saveSuccess && (
                <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 8, color: 'var(--success)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} />
                  Profile updated successfully!
                </div>
              )}

              <div className={styles.profileGrid}>
                {/* Left Column: Avatar */}
                <div className={styles.avatarSection}>
                  <img src={avatar} alt={name} className={styles.avatar} />
                  <span className={styles.avatarBtn} onClick={() => {
                    const newAvatar = prompt('Enter a valid image URL for avatar:', avatar);
                    if (newAvatar) setAvatar(newAvatar);
                  }}>
                    Change Photo
                  </span>
                </div>

                {/* Right Column: Form */}
                <form onSubmit={handleProfileSave} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input} 
                        disabled // Disabled name edit for security
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Professional Title</label>
                      <input 
                        type="text" 
                        value={title} 
                        placeholder="e.g. Senior Frontend Developer"
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input} 
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Professional Bio</label>
                    <textarea 
                      value={bio} 
                      placeholder="Write a short summary about your accomplishments..."
                      onChange={(e) => setBio(e.target.value)}
                      className={styles.textarea}
                      required
                    ></textarea>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Resume PDF Link</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input 
                        type="text" 
                        value={resumeUrl} 
                        placeholder="e.g. https://yourcv.example.com/resume.pdf"
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className={styles.input} 
                        required
                      />
                    </div>
                  </div>

                  {/* Skills Tag Management */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Skills / Technologies</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input 
                        type="text" 
                        placeholder="Type a skill (e.g. React) and click Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className={styles.input} 
                      />
                      <button type="button" onClick={handleAddSkill} className="outline-btn" style={{ padding: '0 16px' }}>
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className={styles.skillsContainer}>
                      {skills.map((skill, index) => (
                        <span key={index} className={styles.skillChip}>
                          {skill}
                          <X size={14} className={styles.skillRemoveBtn} onClick={() => handleRemoveSkill(skill)} />
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
