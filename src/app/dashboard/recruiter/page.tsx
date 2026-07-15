'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Briefcase, Users, Plus, CheckCircle2, Save, X, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function RecruiterDashboard() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();

  // Tab states
  const [activeTab, setActiveTab] = useState<'posted_jobs' | 'profile' | 'post_new_job' | 'applicants'>('posted_jobs');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

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
  const [logoUploading, setLogoUploading] = useState(false);

  // Posted jobs state (initialized empty)
  const [postedJobs, setPostedJobs] = useState<any[]>([]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUploading(true);

      try {
        const formData = new FormData();
        formData.append('image', file);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=4983d5f47f26efc3e85064efe6b1a73c`, {
          method: 'POST',
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        if (imgbbData.success) {
          setAvatar(imgbbData.data.url);
          toast.success('Logo uploaded successfully!');
        } else {
          toast.error('Logo upload failed');
        }
      } catch (err) {
        console.error('Logo Upload Error:', err);
        toast.error('Error uploading logo');
      } finally {
        setLogoUploading(false);
      }
    }
  };

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

      // Fetch recruiter's posted jobs
      const fetchMyJobs = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`);
          if (res.ok) {
            const dbJobs = await res.json();
            const myJobs = dbJobs
              .filter((j: any) => j.recruiterId === user.id)
              .map((j: any) => ({
                id: j._id,
                title: j.title,
                location: j.location,
                type: j.type,
                applications: j.applications || 0,
                status: j.status || 'Active',
                postedAt: j.postedAt ? new Date(j.postedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
              }));
            setPostedJobs(myJobs);
          }
        } catch (error) {
          console.error('Failed to fetch recruiter jobs:', error);
        }
      };
      fetchMyJobs();
    }
  }, [user, loading, router]);

  const handleViewApplicants = async (job: any) => {
    setSelectedJob(job);
    setApplicants([]);
    setApplicantsLoading(true);
    setActiveTab('applicants');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications?jobId=${job.id}`);
      if (res.ok) setApplicants(await res.json());
    } catch (e) { console.error(e); }
    finally { setApplicantsLoading(false); }
  };

  const handleCallForInterview = async (app: any) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications/${app._id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ status: 'Interview Scheduled' })
      });
      setApplicants(prev => prev.map(a => a._id === app._id ? { ...a, status: 'Interview Scheduled' } : a));
      if (app.seekerEmail) {
        window.open(`mailto:${app.seekerEmail}?subject=Interview Invitation - ${app.jobTitle}&body=Dear ${app.seekerName},%0A%0AWe are pleased to invite you for an interview for the ${app.jobTitle} position.%0A%0APlease reply to schedule a convenient time.%0A%0ABest regards,`);
      }
    } catch (e) { console.error(e); }
  };

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
          title: jobTitle,
          location: jobLocation,
          type: jobType,
          companyName: companyName || user.profile.companyName || 'Unknown Company',
          companyLogo: avatar || user.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName || 'Job')}`,
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
          <button onClick={() => setActiveTab('posted_jobs')} className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'posted_jobs' || activeTab === 'post_new_job' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}>
            <Briefcase size={18} /><span>Posted Jobs</span>
          </button>
          <button onClick={() => setActiveTab('applicants')} className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'applicants' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}>
            <Users size={18} /><span>Applicants</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-3 rounded-[var(--border-radius-sm)] font-semibold text-[0.95rem] cursor-pointer w-full text-left transition-all duration-300 ${activeTab === 'profile' ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'}`}>
            <UserIcon size={18} /><span>Company Profile</span>
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
                        <div className="text-[0.85rem] text-[var(--text-muted)]">Posted on: {new Date(job.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-bold text-[var(--accent-cyan)]">{job.applications}</span>
                          <span className="text-[0.8rem] text-[var(--text-muted)] uppercase tracking-wider">Applicants</span>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-[0.8rem] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[var(--success)]">{job.status}</span>
                        <button onClick={() => handleViewApplicants(job)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all duration-300" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: 'var(--accent-cyan)' }}>
                          <Users size={15} /> View Applicants
                        </button>
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

          {/* Applicants Panel */}
          {activeTab === 'applicants' && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-8 shadow-[var(--shadow-glass)]">
              {!selectedJob ? (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                  <Users size={44} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold mb-2">No job selected</p>
                  <p className="text-sm mb-4">Go to <span className="text-[var(--accent-cyan)] font-semibold">Posted Jobs</span> and click &quot;View Applicants&quot; on a job.</p>
                  <button onClick={() => setActiveTab('posted_jobs')} className="accent-btn">
                    <ArrowLeft size={16} /> Go to Posted Jobs
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6 border-b border-[var(--border-color)] pb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Applicants</h2>
                      <p className="text-[var(--text-secondary)] text-sm mt-1">{selectedJob.title} • {selectedJob.location}</p>
                    </div>
                    <button onClick={() => setActiveTab('posted_jobs')} className="outline-btn py-2 text-[0.9rem]"><ArrowLeft size={16} /> Back</button>
                  </div>
                  {applicantsLoading ? (
                    <div className="flex justify-center items-center py-16"><div className="w-10 h-10 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div></div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-16 text-[var(--text-secondary)]">
                      <Users size={40} className="mx-auto mb-3 opacity-40" />
                      <p>No applications received yet for this job.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {applicants.map((app) => (
                        <div key={app._id} className="border border-[var(--border-color)] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[var(--border-color-hover)] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' }}>
                              {app.seekerName?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--text-primary)] text-[1.05rem]">{app.seekerName}</div>
                              {app.seekerEmail && <div className="text-sm text-[var(--text-secondary)] mt-0.5">{app.seekerEmail}</div>}
                              {app.seekerPhone && <div className="text-sm text-[var(--text-muted)] mt-0.5">{app.seekerPhone}</div>}
                              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider ${app.status === 'Interview Scheduled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{app.status}</span>
                                <span className="text-xs text-[var(--text-muted)]">{new Date(app.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => handleCallForInterview(app)}
                              disabled={app.status === 'Interview Scheduled'}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.85rem] font-semibold transition-all duration-300"
                              style={{ background: app.status === 'Interview Scheduled' ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg, #10b981, #06b6d4)', color: app.status === 'Interview Scheduled' ? '#10b981' : '#fff', border: app.status === 'Interview Scheduled' ? '1px solid rgba(16,185,129,0.2)' : 'none', opacity: app.status === 'Interview Scheduled' ? 0.7 : 1, cursor: app.status === 'Interview Scheduled' ? 'default' : 'pointer' }}
                            >
                              <Phone size={15} />
                              {app.status === 'Interview Scheduled' ? 'Invited ✓' : 'Call for Interview'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
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
                  <label htmlFor="companyLogoUpload" className="relative group cursor-pointer w-[120px] h-[120px]">
                    <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover border-2 border-[var(--accent-purple)] bg-[var(--bg-secondary)] transition-all duration-300 group-hover:opacity-75" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[0.75rem] text-white font-bold text-center px-1">Upload Logo</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="companyLogoUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                  />
                  <span className="text-[0.8rem] text-[var(--accent-cyan)] cursor-pointer font-semibold" onClick={() => document.getElementById('companyLogoUpload')?.click()}>
                    {logoUploading ? 'Uploading...' : 'Change Logo'}
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
