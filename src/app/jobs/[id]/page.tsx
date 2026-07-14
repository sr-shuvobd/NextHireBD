'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Globe, 
  User, 
  FileText, 
  CheckCircle2, 
  X,
  Lock
} from 'lucide-react';
import { getJobById, applyForJob, getApplications } from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('/uploads/resumes/shuvo_resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      // First try mock data
      const mockJob = getJobById(id);
      if (mockJob) {
        setJob(mockJob);
        setLoadingJob(false);
        return;
      }

      // If not in mock, fetch from server
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        if (res.ok) {
          const dbJobs = await res.json();
          const found = dbJobs.find((j: any) => j._id === id);
          if (found) {
            setJob({
              id: found._id,
              title: found.title,
              companyName: found.companyName || 'Unknown Company',
              companyLogo: found.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(found.companyName || 'Job')}`,
              location: found.location,
              workType: found.location.toLowerCase().includes('remote') ? 'remote' : 'onsite',
              jobType: found.type.toLowerCase(),
              salaryMin: parseInt(found.salary?.split('-')[0]?.replace(/[^0-9]/g, '')) || 0,
              salaryMax: parseInt(found.salary?.split('-')[1]?.replace(/[^0-9]/g, '')) || 150000,
              currency: 'BDT',
              skillsRequired: found.skillsRequired ? found.skillsRequired.split(',').map((s: string) => s.trim()) : [],
              category: 'Tech',
              description: `### Job Description\n\n${found.description || 'No description provided.'}\n\n### Job Requirements\n\n${found.requirements || 'No requirements specified.'}`,
              createdAt: found.postedAt
            });
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoadingJob(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (loadingJob) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <span>Loading Job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-[1100px] mx-auto px-6 py-10 w-full">
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <h2>Job Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
            The job listing you are looking for does not exist or has expired.
          </p>
          <Link href="/jobs" className="accent-btn">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user has already applied
  const allApps = getApplications();
  const hasApplied = user ? allApps.some(app => app.jobId === job.id && app.seekerId === user.id) : false;

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate API network latency
    await new Promise(resolve => setTimeout(resolve, 1200));

    const result = applyForJob(job.id, user.id, user.name, coverLetter, resumeUrl);
    setIsSubmitting(false);

    if (result) {
      setSuccess(true);
    } else {
      setErrorMsg('Failed to apply. You might have already applied for this job.');
    }
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10 w-full">
      {/* Back Button */}
      <Link href="/jobs" className="inline-flex items-center gap-2 text-[var(--text-secondary)] font-medium mb-6 hover:text-[var(--text-primary)] hover:-translate-x-1 transition-all duration-300">
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Main Details Card */}
        <main className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 md:p-10 shadow-[var(--shadow-glass)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-[var(--border-color)] pb-8 mb-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <img src={job.companyLogo} alt={job.companyName} className="w-20 h-20 rounded-[var(--border-radius-sm)] object-cover border border-[var(--border-color-hover)] bg-[var(--bg-secondary)]" />
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-[1.1rem] text-[var(--text-secondary)]">
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{job.companyName}</span>
                  <span>•</span>
                  <span>{job.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Content (Rendered as text styling) */}
          <div className="leading-relaxed text-[var(--text-primary)] text-[1.05rem]">
            {/* Split description paragraphs */}
            {job.description.split('\n\n').map((paragraph: string, index: number) => {
              if (paragraph.trim().startsWith('###')) {
                return <h3 key={index} className="text-xl font-bold mt-8 mb-4 border-l-[3px] border-[var(--accent-cyan)] pl-3 text-[var(--text-primary)]">{paragraph.replace('###', '').trim()}</h3>;
              }
              if (paragraph.trim().startsWith('*')) {
                return (
                  <ul key={index} className="pl-5 mb-6 flex flex-col gap-2 list-disc">
                    {paragraph.split('\n').map((li: string, liIdx: number) => (
                      <li key={liIdx} className="text-[var(--text-secondary)]">{li.replace('*', '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index} style={{ marginBottom: 16 }}>{paragraph.trim()}</p>;
            })}
          </div>

          {/* Skills Required Section */}
          <div className="mt-10 border-t border-[var(--border-color)] pt-8">
            <h4 className="text-[1.15rem] font-bold mb-4">Skills Required</h4>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill: string, index: number) => (
                <span key={index} className="bg-white/[0.04] border border-[var(--border-color)] px-3.5 py-1.5 rounded-full text-[0.85rem] font-medium">{skill}</span>
              ))}
            </div>
          </div>
        </main>

        {/* Sticky Sidebar */}
        <aside className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-8 shadow-[var(--shadow-glass)] flex flex-col gap-6 sticky top-[100px]">
          <h3 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Job Summary</h3>
          
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-[var(--border-radius-sm)] bg-[var(--accent-cyan)]/8 text-[var(--accent-cyan)] flex items-center justify-center"><DollarSign size={20} /></div>
            <div>
              <div className="text-[0.85rem] text-[var(--text-secondary)] uppercase tracking-wider">Salary Offer</div>
              <div className="text-[1rem] font-semibold text-[var(--text-primary)]">
                {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency} / Mo
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-[var(--border-radius-sm)] bg-[var(--accent-cyan)]/8 text-[var(--accent-cyan)] flex items-center justify-center"><MapPin size={20} /></div>
            <div>
              <div className="text-[0.85rem] text-[var(--text-secondary)] uppercase tracking-wider">Location</div>
              <div className="text-[1rem] font-semibold text-[var(--text-primary)]">{job.location}</div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-[var(--border-radius-sm)] bg-[var(--accent-cyan)]/8 text-[var(--accent-cyan)] flex items-center justify-center"><Briefcase size={20} /></div>
            <div>
              <div className="text-[0.85rem] text-[var(--text-secondary)] uppercase tracking-wider">Job Type</div>
              <div className="text-[1rem] font-semibold text-[var(--text-primary)]" style={{ textTransform: 'capitalize' }}>
                {job.jobType.replace('-', ' ')}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-[var(--border-radius-sm)] bg-[var(--accent-cyan)]/8 text-[var(--accent-cyan)] flex items-center justify-center"><Globe size={20} /></div>
            <div>
              <div className="text-[0.85rem] text-[var(--text-secondary)] uppercase tracking-wider">Work Setting</div>
              <div className="text-[1rem] font-semibold text-[var(--text-primary)]" style={{ textTransform: 'capitalize' }}>
                {job.workType}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-[var(--border-radius-sm)] bg-[var(--accent-cyan)]/8 text-[var(--accent-cyan)] flex items-center justify-center"><Calendar size={20} /></div>
            <div>
              <div className="text-[0.85rem] text-[var(--text-secondary)] uppercase tracking-wider">Date Posted</div>
              <div className="text-[1rem] font-semibold text-[var(--text-primary)]">{formattedDate}</div>
            </div>
          </div>

          {/* Action Button */}
          {hasApplied ? (
            <button className="outline-btn" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--success)', color: 'var(--success)', cursor: 'default' }} disabled>
              <CheckCircle2 size={18} />
              Applied Successfully
            </button>
          ) : user ? (
            user.role === 'seeker' ? (
              <button onClick={() => setModalOpen(true)} className="accent-btn" style={{ width: '100%', justifyContent: 'center' }}>
                Apply For This Job
              </button>
            ) : (
              <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Only Job Seekers can apply for roles.
              </div>
            )
          ) : (
            <Link href="/login" className="accent-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Lock size={16} />
              Sign In to Apply
            </Link>
          )}
        </aside>
      </div>

      {/* Application Popup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] flex items-center justify-center z-[1000] p-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--border-radius-md)] shadow-[var(--shadow-glass)] max-w-[550px] w-full p-8 relative animate-[float_0.3s_ease-out]">
            <button className="absolute top-5 right-5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>

            {!success ? (
              <>
                <h3 className="text-2xl font-extrabold mb-2">Apply for {job.title}</h3>
                <p className="text-[var(--text-secondary)] text-[0.95rem] mb-6">at {job.companyName}</p>

                {errorMsg && (
                  <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, color: 'var(--error)', marginBottom: 16, fontSize: '0.9rem' }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleApplySubmit}>
                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Resume URL</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '10px 14px' }}>
                      <FileText size={18} color="var(--accent-cyan)" />
                      <input 
                        type="text" 
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        style={{ width: '100%', color: '#ffffff', fontSize: '0.9rem' }}
                        required
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      We used your profile&apos;s uploaded resume. Edit above if you want to provide another link.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-[0.9rem] font-semibold text-[var(--text-primary)]">Cover Letter</label>
                    <textarea 
                      placeholder="Write a brief cover letter introducing yourself..."
                      className="w-full min-h-[120px] bg-white/[0.02] border border-[var(--border-color)] rounded-[var(--border-radius-sm)] p-3 text-[var(--text-primary)] text-[0.95rem] resize-y transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.05] outline-none"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="accent-btn" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-extrabold mb-2">Application Submitted!</h3>
                <p className="text-[var(--text-secondary)] text-[0.95rem] mb-6" style={{ marginBottom: 16 }}>
                  Your application for **{job.title}** at **{job.companyName}** has been sent successfully.
                </p>
                <button 
                  onClick={() => { setModalOpen(false); setSuccess(false); }} 
                  className="accent-btn" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Great, Thank You!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
