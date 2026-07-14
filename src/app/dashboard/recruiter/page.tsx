'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Briefcase, Users, Plus, CheckCircle2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function RecruiterDashboard() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  
  // Tab states: 'posted_jobs' | 'profile' | 'post_new_job'
  const [activeTab, setActiveTab] = useState<'posted_jobs' | 'profile' | 'post_new_job'>('posted_jobs');
  
  // Profile Form States
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // Job Post States
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobExperienceLevel, setJobExperienceLevel] = useState('Mid-Level');
  const [jobSkillsRequired, setJobSkillsRequired] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Dummy posted jobs data
  const [postedJobs, setPostedJobs] = useState<any[]>([
    { id: '1', title: 'Senior Frontend Developer', location: 'Dhaka (Remote)', type: 'Full-Time', applications: 12, status: 'Active', postedAt: '2023-10-15' },
    { id: '2', title: 'Backend Engineer (Node.js)', location: 'Dhaka (Onsite)', type: 'Full-Time', applications: 5, status: 'Active', postedAt: '2023-11-02' },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?role=recruiter');
      return;
    }

    if (user) {
      if (user.role !== 'recruiter') {
        router.push(user.role === 'seeker' ? '/dashboard/seeker' : '/');
        return;
      }

      setTimeout(() => {
        setName(user.name);
        setCompanyName(user.profile.companyName || '');
        setCompanyWebsite(user.profile.companyWebsite || '');
        setBio(user.profile.bio || '');
        setAvatar(user.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`);
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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateProfile({
      companyName,
      companyWebsite,
      bio,
      avatar
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          location: jobLocation,
          type: jobType,
          companyName: companyName || user.profile.companyName || 'Unknown Company',
          recruiterId: user.id,
          salary: jobSalary,
          description: jobDescription,
          requirements: jobRequirements,
          experienceLevel: jobExperienceLevel,
          skillsRequired: jobSkillsRequired
        })
      });

      if (res.ok) {
        const newJob = await res.json();
        // Add it to our local state so it shows up immediately
        setPostedJobs([
          {
            id: newJob._id,
            title: newJob.title,
            location: newJob.location,
            type: newJob.type,
            applications: 0,
            status: newJob.status,
            postedAt: newJob.postedAt
          },
          ...postedJobs
        ]);
        toast.success('Job posted successfully to Database!');
        
        // Reset form
        setJobTitle('');
        setJobLocation('');
        setJobType('Full-Time');
        setJobSalary('');
        setJobDescription('');
        setJobRequirements('');
        setJobExperienceLevel('Mid-Level');
        setJobSkillsRequired('');
        setActiveTab('posted_jobs');
      } else {
        toast.error('Failed to post job');
      }
    } catch (error) {
      console.error('Job Post Error:', error);
      toast.error('Server error while posting job');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 w-full">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.profile.companyName || 'Recruiter'} • Employer Portal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 mt-6 items-start">
        {/* Sidebar Nav */}
        <aside className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('posted_jobs')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'posted_jobs' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <Briefcase size={18} />
            <span>Posted Jobs</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'profile' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}
          >
            <UserIcon size={18} />
            <span>Company Profile</span>
          </button>
        </aside>

        {/* Panel Area */}
        <main className="flex flex-col gap-6">
          {/* Posted Jobs Tab */}
          {activeTab === 'posted_jobs' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-[var(--border-color)] pb-3 gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Manage Jobs</h2>
                <button className="accent-btn py-2" onClick={() => setActiveTab('post_new_job')}>
                  <Plus size={18} />
                  Post New Job
                </button>
              </div>
              
              {postedJobs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {postedJobs.map((job) => (
                    <div key={job.id} className="bg-white/[0.01] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[var(--border-color-hover)] hover:bg-white/[0.02] transition-all duration-300">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[1.15rem] font-bold text-[var(--text-primary)]">{job.title}</div>
                        <div className="text-[0.95rem] text-[var(--text-secondary)]">{job.type} • {job.location}</div>
                        <div className="text-[0.85rem] text-[var(--text-muted)]">
                          Posted on: {new Date(job.postedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-bold text-[var(--accent-cyan)]">{job.applications}</span>
                          <span className="text-[0.8rem] text-[var(--text-muted)] uppercase tracking-wider">Applicants</span>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-[0.8rem] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[var(--success)]">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
                  <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.5, margin: '0 auto' }} />
                  <div>You haven't posted any jobs yet.</div>
                  <button className="accent-btn" style={{ marginTop: 16 }} onClick={() => setActiveTab('post_new_job')}>
                    <Plus size={18} />
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Post New Job Tab */}
          {activeTab === 'post_new_job' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-[var(--border-color)] pb-3 gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Post a New Job</h2>
                <button className="outline-btn py-2 text-[0.9rem]" onClick={() => setActiveTab('posted_jobs')}>
                  <X size={16} /> Cancel
                </button>
              </div>

              <form onSubmit={handlePostJob} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Job Title</label>
                  <input 
                    type="text" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior React Developer"
                    className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Location</label>
                    <input 
                      type="text" 
                      value={jobLocation} 
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="e.g. Dhaka (Remote)"
                      className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                      required 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Job Type</label>
                    <select 
                      value={jobType} 
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none appearance-none" 
                      required
                    >
                      <option value="Full-Time" className="bg-[var(--bg-primary)]">Full-Time</option>
                      <option value="Part-Time" className="bg-[var(--bg-primary)]">Part-Time</option>
                      <option value="Contract" className="bg-[var(--bg-primary)]">Contract</option>
                      <option value="Internship" className="bg-[var(--bg-primary)]">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Salary / Compensation</label>
                    <input 
                      type="text" 
                      value={jobSalary} 
                      onChange={(e) => setJobSalary(e.target.value)}
                      placeholder="e.g. 50,000 - 80,000 BDT or Negotiable"
                      className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                      required 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Experience Level</label>
                    <select 
                      value={jobExperienceLevel} 
                      onChange={(e) => setJobExperienceLevel(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none appearance-none" 
                      required
                    >
                      <option value="Entry-Level" className="bg-[var(--bg-primary)]">Entry-Level</option>
                      <option value="Mid-Level" className="bg-[var(--bg-primary)]">Mid-Level</option>
                      <option value="Senior-Level" className="bg-[var(--bg-primary)]">Senior-Level</option>
                      <option value="Executive" className="bg-[var(--bg-primary)]">Executive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Skills Required (Comma separated)</label>
                  <input 
                    type="text" 
                    value={jobSkillsRequired} 
                    onChange={(e) => setJobSkillsRequired(e.target.value)}
                    placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                    className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Job Description</label>
                  <textarea 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe the job role, tasks, daily operations..."
                    className="w-full min-h-[120px] px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] resize-y transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Requirements / Qualifications</label>
                  <textarea 
                    value={jobRequirements} 
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="What qualifications, degrees, or certifications are required?"
                    className="w-full min-h-[120px] px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] resize-y transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="accent-btn" 
                  style={{ alignSelf: 'flex-start', marginTop: 12 }}
                  disabled={isPosting}
                >
                  <Save size={18} />
                  {isPosting ? 'Posting to DB...' : 'Post Job'}
                </button>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-3">Company Configuration</h2>

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
                    const newAvatar = prompt('Enter a valid image URL for company logo:', avatar);
                    if (newAvatar) setAvatar(newAvatar);
                  }}>
                    Change Logo
                  </span>
                </div>

                {/* Right Column: Form */}
                <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Recruiter Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                        disabled 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Company Name</label>
                      <input 
                        type="text" 
                        value={companyName} 
                        placeholder="e.g. TechCorp Solutions"
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Company Website</label>
                    <input 
                      type="url" 
                      value={companyWebsite} 
                      placeholder="e.g. https://example.com"
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Company Bio / Description</label>
                    <textarea 
                      value={bio} 
                      placeholder="Write a short summary about your company..."
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full min-h-[100px] px-3.5 py-3 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.95rem] resize-y transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.04] outline-none"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="accent-btn" 
                    style={{ alignSelf: 'flex-start', marginTop: 12 }}
                    disabled={isSaving}
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving Changes...' : 'Save Company Details'}
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
