'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Briefcase, DollarSign, Filter, RefreshCw, X } from 'lucide-react';
import { getJobs, Job } from '@/services/mockData';
import styles from './jobs.module.css';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial query params
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialWorkType = searchParams.get('workType') || '';

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(initialWorkType ? [initialWorkType] : []);
  const [minSalary, setMinSalary] = useState<number>(0);

  // Job Listing state
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Read list of jobs
    const allJobs = getJobs();
    
    // Filter jobs
    const result = allJobs.filter((job) => {
      const matchSearch = 
        !search || 
        job.title.toLowerCase().includes(search.toLowerCase()) || 
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.skillsRequired.some(s => s.toLowerCase().includes(search.toLowerCase()));

      const matchLocation = 
        !location || 
        job.location.toLowerCase().includes(location.toLowerCase()) ||
        (location.toLowerCase() === 'remote' && job.workType === 'remote');

      const matchCategory = 
        !category || 
        job.category.toLowerCase() === category.toLowerCase();

      const matchJobType = 
        selectedJobTypes.length === 0 || 
        selectedJobTypes.includes(job.jobType);

      const matchWorkType = 
        selectedWorkTypes.length === 0 || 
        selectedWorkTypes.includes(job.workType);

      const matchSalary = 
        !minSalary || 
        job.salaryMax >= minSalary;

      return matchSearch && matchLocation && matchCategory && matchJobType && matchWorkType && matchSalary;
    });

    setFilteredJobs(result);
  }, [search, location, category, selectedJobTypes, selectedWorkTypes, minSalary]);

  const handleJobTypeChange = (type: string) => {
    setSelectedJobTypes((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleWorkTypeChange = (type: string) => {
    setSelectedWorkTypes((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setCategory('');
    setSelectedJobTypes([]);
    setSelectedWorkTypes([]);
    setMinSalary(0);
    router.push('/jobs');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Find Your Next Dream Role</h1>
        <p className={styles.subtitle}>Explore opportunities from the highest-quality tech networks</p>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <aside className={styles.filters}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              <Filter size={18} />
              <span>Filters</span>
            </h3>
            <button 
              onClick={handleReset} 
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--accent-purple)', cursor: 'pointer' }}
            >
              <RefreshCw size={14} />
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Keyword Search</label>
            <div className={styles.searchField}>
              <Search size={16} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="Title, company, skill..." 
                className={styles.filterInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Location Input */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Location</label>
            <div className={styles.searchField}>
              <MapPin size={16} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="City or 'remote'..." 
                className={styles.filterInput}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Category</label>
            <select 
              className={styles.filterInput} 
              style={{ paddingLeft: '12px', cursor: 'pointer', background: '#0f172a' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Tech">Technology</option>
              <option value="Design">UI/UX Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Job Types */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Job Type</label>
            {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
              <label key={type} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedJobTypes.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>

          {/* Work Types */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Work Settings</label>
            {['remote', 'hybrid', 'onsite'].map((type) => (
              <label key={type} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedWorkTypes.includes(type)}
                  onChange={() => handleWorkTypeChange(type)}
                />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
              </label>
            ))}
          </div>

          {/* Min Salary */}
          <div className={styles.filterGroup}>
            <label className={styles.filterTitle}>Minimum Salary</label>
            <div className={styles.searchField}>
              <DollarSign size={16} className={styles.inputIcon} />
              <input 
                type="number" 
                placeholder="Min Salary (BDT)..." 
                className={styles.filterInput}
                value={minSalary || ''}
                onChange={(e) => setMinSalary(Number(e.target.value))}
              />
            </div>
          </div>
        </aside>

        {/* Listings Section */}
        <main className={styles.listingsContainer}>
          <div className={styles.resultsBar}>
            <div>Showing {filteredJobs.length} matching opportunities</div>
          </div>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobInfo}>
                  <img src={job.companyLogo} alt={job.companyName} className={styles.companyLogo} />
                  <div className={styles.jobDetails}>
                    <Link href={`/jobs/${job.id}`} className={styles.jobTitle}>
                      {job.title}
                    </Link>
                    <div className={styles.companyMeta}>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{job.companyName}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} />
                        {job.location} ({job.workType})
                      </span>
                    </div>
                    <div className={styles.tags}>
                      <span className={`${styles.tag} ${styles.purpleTag}`}>{job.jobType.toUpperCase()}</span>
                      <span className={`${styles.tag} ${styles.cyanTag}`}>
                        {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
                      </span>
                      {job.skillsRequired.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className={styles.tag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Link href={`/jobs/${job.id}`} className={styles.applyBtn}>
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Briefcase size={48} color="var(--text-muted)" style={{ animation: 'float 3s ease-in-out infinite' }} />
              <h3 className={styles.emptyTitle}>No Jobs Match Filters</h3>
              <p className={styles.emptyText}>
                Try adjusting your keywords, work settings, or category filters to find matching listings.
              </p>
              <button onClick={handleReset} className="outline-btn" style={{ marginTop: 12 }}>
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span>Loading Job Directory...</span>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
