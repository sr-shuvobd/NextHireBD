'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Briefcase, DollarSign, Filter, RefreshCw, X } from 'lucide-react';
import { getJobs, Job } from '@/services/mockData';
import Loader from '@/components/shared/Loader';

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
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs from server
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (location) queryParams.append('location', location);
        if (selectedJobTypes.length > 0) queryParams.append('type', selectedJobTypes.join(','));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs?${queryParams.toString()}`);
        if (res.ok) {
          const dbJobs = await res.json();
          const mappedJobs = dbJobs.map((dbJob: any) => ({
            id: dbJob._id,
            title: dbJob.title,
            companyName: dbJob.companyName || 'Unknown Company',
            companyLogo: dbJob.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dbJob.companyName || 'Job')}`,
            location: dbJob.location,
            workType: dbJob.location.toLowerCase().includes('remote') ? 'remote' : 'onsite',
            jobType: dbJob.type.toLowerCase(),
            salaryMin: parseInt(dbJob.salary?.split('-')[0]?.replace(/[^0-9]/g, '')) || 0,
            salaryMax: parseInt(dbJob.salary?.split('-')[1]?.replace(/[^0-9]/g, '')) || 150000,
            currency: 'BDT',
            skillsRequired: dbJob.skillsRequired ? dbJob.skillsRequired.split(',').map((s: string) => s.trim()) : [],
            category: 'Tech'
          }));
          setAllJobs(mappedJobs);
          setFilteredJobs(mappedJobs);
        } else {
          setAllJobs([]);
          setFilteredJobs([]);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setAllJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [search, location, selectedJobTypes]);

  // Filter jobs logic for local-only filters
  useEffect(() => {
    const result = allJobs.filter((job) => {
      const matchCategory = 
        !category || 
        job.category.toLowerCase() === category.toLowerCase();

      const matchWorkType = 
        selectedWorkTypes.length === 0 || 
        selectedWorkTypes.includes(job.workType);

      const matchSalary = 
        !minSalary || 
        job.salaryMax >= minSalary;

      return matchCategory && matchWorkType && matchSalary;
    });

    setFilteredJobs(result);
  }, [allJobs, category, selectedWorkTypes, minSalary]);

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
    <div className="max-w-[1200px] mx-auto px-6 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Find Your Next Dream Role</h1>
        <p className="text-[var(--text-secondary)]">Explore opportunities from the highest-quality tech networks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 flex flex-col gap-6 sticky top-[100px]">
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
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Keyword Search</label>
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Title, company, skill..." 
                className="w-full pl-9 pr-3.5 py-2.5 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.9rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.05] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Location</label>
            <div className="relative flex items-center">
              <MapPin size={16} className="absolute left-3 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="City or 'remote'..." 
                className="w-full pl-9 pr-3.5 py-2.5 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.9rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.05] outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Category</label>
            <select 
              className="w-full px-3.5 py-2.5 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.9rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.05] outline-none cursor-pointer" 
              style={{ cursor: 'pointer', background: '#0f172a' }}
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
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Job Type</label>
            {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
              <label key={type} className="flex items-center gap-2.5 text-[var(--text-secondary)] text-[0.9rem] cursor-pointer transition-all duration-300 hover:text-[var(--text-primary)]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-[var(--accent-purple)] cursor-pointer"
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
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Work Settings</label>
            {['remote', 'hybrid', 'onsite'].map((type) => (
              <label key={type} className="flex items-center gap-2.5 text-[var(--text-secondary)] text-[0.9rem] cursor-pointer transition-all duration-300 hover:text-[var(--text-primary)]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-[var(--accent-purple)] cursor-pointer"
                  checked={selectedWorkTypes.includes(type)}
                  onChange={() => handleWorkTypeChange(type)}
                />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
              </label>
            ))}
          </div>

          {/* Min Salary */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Minimum Salary</label>
            <div className="relative flex items-center">
              <DollarSign size={16} className="absolute left-3 text-[var(--text-muted)]" />
              <input 
                type="number" 
                placeholder="Min Salary (BDT)..." 
                className="w-full pl-9 pr-3.5 py-2.5 rounded-[var(--border-radius-sm)] border border-[var(--border-color)] bg-white/[0.02] text-[var(--text-primary)] text-[0.9rem] transition-all duration-300 focus:border-[var(--accent-purple)] focus:bg-white/[0.05] outline-none"
                value={minSalary || ''}
                onChange={(e) => setMinSalary(Number(e.target.value))}
              />
            </div>
          </div>
        </aside>

        {/* Listings Section */}
        <main className="flex flex-col gap-6">
          <div className="flex justify-between items-center text-[var(--text-secondary)] text-[0.95rem]">
            <div>Showing {filteredJobs.length} matching opportunities</div>
          </div>

          {isLoading ? (
            <Loader />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-[var(--border-radius-sm)] object-cover border border-[var(--border-color-hover)] bg-[var(--bg-secondary)]" />
                  <div className="flex flex-col gap-1.5">
                    <Link href={`/jobs/${job.id}`} className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-purple)] transition-all duration-300">
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-[0.95rem] text-[var(--text-secondary)]">
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{job.companyName}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} />
                        {job.location} ({job.workType})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-1 rounded-[6px] text-[0.8rem] font-medium">{job.jobType.toUpperCase()}</span>
                      <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-[6px] text-[0.8rem] font-medium">
                        {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
                      </span>
                      {job.skillsRequired.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className="bg-white/[0.04] border border-[var(--border-color)] px-2.5 py-1 rounded-[6px] text-[0.8rem] font-medium text-[var(--text-secondary)]">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Link href={`/jobs/${job.id}`} className="bg-gradient-to-r from-[var(--accent-purple)] to-[#7c3aed] text-white px-5 py-2.5 rounded-[var(--border-radius-sm)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] transition-all duration-300 text-center whitespace-nowrap">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center text-[var(--text-muted)]">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">No jobs found</h3>
              <p className="text-[var(--text-secondary)] max-w-md">We couldn't find any jobs matching your current filters. Try adjusting your search or clearing filters to see more results.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  setCategory('');
                  setSelectedJobTypes([]);
                  setSelectedWorkTypes([]);
                  setMinSalary(0);
                }}
                className="mt-4 outline-btn"
                style={{ padding: '8px 20px' }}
              >
                Clear all filters
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
