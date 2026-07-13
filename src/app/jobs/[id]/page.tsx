'use client';

import React, { useState, use } from 'react';
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
import styles from './details.module.css';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const job = getJobById(id);

  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('/uploads/resumes/shuvo_resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!job) {
    return (
      <div className={styles.container}>
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
    <div className={styles.container}>
      {/* Back Button */}
      <Link href="/jobs" className={styles.backBtn}>
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className={styles.layout}>
        {/* Main Details Card */}
        <main className={styles.mainCard}>
          {/* Header */}
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <img src={job.companyLogo} alt={job.companyName} className={styles.companyLogo} />
              <div>
                <h1 className={styles.title}>{job.title}</h1>
                <div className={styles.companyMeta}>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{job.companyName}</span>
                  <span>•</span>
                  <span>{job.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Content (Rendered as text styling) */}
          <div className={styles.richContent}>
            {/* Split description paragraphs */}
            {job.description.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('###')) {
                return <h3 key={index}>{paragraph.replace('###', '').trim()}</h3>;
              }
              if (paragraph.trim().startsWith('*')) {
                return (
                  <ul key={index}>
                    {paragraph.split('\n').map((li, liIdx) => (
                      <li key={liIdx}>{li.replace('*', '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index} style={{ marginBottom: 16 }}>{paragraph.trim()}</p>;
            })}
          </div>

          {/* Skills Required Section */}
          <div className={styles.skillsGroup}>
            <h4 className={styles.skillsTitle}>Skills Required</h4>
            <div className={styles.skills}>
              {job.skillsRequired.map((skill, index) => (
                <span key={index} className={styles.skillChip}>{skill}</span>
              ))}
            </div>
          </div>
        </main>

        {/* Sticky Sidebar */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Job Summary</h3>
          
          <div className={styles.metaItem}>
            <div className={styles.metaIcon}><DollarSign size={20} /></div>
            <div>
              <div className={styles.metaLabel}>Salary Offer</div>
              <div className={styles.metaValue}>
                {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency} / Mo
              </div>
            </div>
          </div>

          <div className={styles.metaItem}>
            <div className={styles.metaIcon}><MapPin size={20} /></div>
            <div>
              <div className={styles.metaLabel}>Location</div>
              <div className={styles.metaValue}>{job.location}</div>
            </div>
          </div>

          <div className={styles.metaItem}>
            <div className={styles.metaIcon}><Briefcase size={20} /></div>
            <div>
              <div className={styles.metaLabel}>Job Type</div>
              <div className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
                {job.jobType.replace('-', ' ')}
              </div>
            </div>
          </div>

          <div className={styles.metaItem}>
            <div className={styles.metaIcon}><Globe size={20} /></div>
            <div>
              <div className={styles.metaLabel}>Work Setting</div>
              <div className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
                {job.workType}
              </div>
            </div>
          </div>

          <div className={styles.metaItem}>
            <div className={styles.metaIcon}><Calendar size={20} /></div>
            <div>
              <div className={styles.metaLabel}>Date Posted</div>
              <div className={styles.metaValue}>{formattedDate}</div>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>

            {!success ? (
              <>
                <h3 className={styles.modalTitle}>Apply for {job.title}</h3>
                <p className={styles.modalSubtitle}>at {job.companyName}</p>

                {errorMsg && (
                  <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, color: 'var(--error)', marginBottom: 16, fontSize: '0.9rem' }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleApplySubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Resume URL</label>
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
                      We used your profile's uploaded resume. Edit above if you want to provide another link.
                    </span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cover Letter</label>
                    <textarea 
                      placeholder="Write a brief cover letter introducing yourself..."
                      className={styles.textarea}
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
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 className={styles.modalTitle}>Application Submitted!</h3>
                <p className={styles.modalSubtitle} style={{ marginBottom: 16 }}>
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
