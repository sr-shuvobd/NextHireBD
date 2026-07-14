'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Code, 
  Palette, 
  Megaphone, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Building2, 
  Users, 
  Sparkles 
} from 'lucide-react';
import { getJobs } from '@/services/mockData';

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  // Get first 3 jobs as featured
  const featuredJobs = getJobs().slice(0, 3);

  const categories = [
    { name: 'Technology', count: '120+ Jobs', icon: <Code size={24} /> },
    { name: 'Design', count: '45+ Jobs', icon: <Palette size={24} /> },
    { name: 'Marketing', count: '32+ Jobs', icon: <Megaphone size={24} /> },
    { name: 'Management', count: '18+ Jobs', icon: <Layers size={24} /> }
  ];

  const stats = [
    { number: '1,200+', label: 'Active Jobs', icon: <TrendingUp size={20} /> },
    { number: '450+', label: 'Tech Companies', icon: <Building2 size={20} /> },
    { number: '8,000+', label: 'Candidates Registered', icon: <Users size={20} /> },
    { number: '100%', label: 'Remote Friendly', icon: <Globe size={20} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-16 max-w-[900px] mx-auto gap-6">
        <div className="bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-400 text-[0.9rem] font-semibold inline-flex items-center gap-2 mb-2 animate-[float_4s_ease-in-out_infinite]">
          <Sparkles size={16} />
          <span>Next Generation Job Search Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em]">
          Discover the Future of <br />
          <span className="gradient-text">Tech Careers</span> in Bangladesh
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-[650px]">
          NextHireBD connects top developers, creative designers, and tech leaders with remote, hybrid, and onsite roles at world-class companies.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[800px] mt-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 p-3 bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-lg)] shadow-[var(--shadow-glass)]">
            <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--border-radius-md)] bg-white/[0.02] border border-transparent focus-within:border-violet-500/30 focus-within:bg-white/[0.04] transition-all duration-300">
              <Search size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Job Title, Skills, or Company..." 
                className="w-full text-[0.95rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-none outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--border-radius-md)] bg-white/[0.02] border border-transparent focus-within:border-violet-500/30 focus-within:bg-white/[0.04] transition-all duration-300">
              <MapPin size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="City, Country or Remote..." 
                className="w-full text-[0.95rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-none outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="bg-gradient-to-r from-[var(--accent-purple)] to-[#7c3aed] text-white px-7 py-3 rounded-[var(--border-radius-md)] font-semibold cursor-pointer shadow-[0_4px_15px_var(--accent-purple-glow)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] active:translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
              <span>Search Jobs</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1100px] mx-auto w-full px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 text-center shadow-[var(--shadow-glass)] hover:border-[var(--border-color-hover)] hover:-translate-y-1 hover:shadow-[0_8px_32px_var(--accent-purple-glow)] transition-all duration-300">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">{stat.number}</div>
              <div className="text-[var(--text-secondary)] text-[0.95rem] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-[1100px] mx-auto w-full px-6 flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold">Popular Categories</h2>
            <p className="text-[var(--text-secondary)] mt-2 text-base">Explore matching roles based on your domain expertise</p>
          </div>
          <Link href="/jobs" className="outline-btn" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="group bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
              onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className="w-12 h-12 rounded-[var(--border-radius-sm)] bg-violet-500/10 flex items-center justify-center text-[var(--accent-purple)] transition-all duration-300 group-hover:bg-[var(--accent-purple)] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">{cat.icon}</div>
              <div>
                <div className="text-[1.1rem] font-bold text-[var(--text-primary)]">{cat.name}</div>
                <div className="text-[0.9rem] text-[var(--text-muted)]">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-[1100px] mx-auto w-full px-6 flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold">Featured Opportunities</h2>
            <p className="text-[var(--text-secondary)] mt-2 text-base">Top jobs hand-picked for quality and relevance</p>
          </div>
          <Link href="/jobs" className="outline-btn" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            <span>Find More Jobs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {featuredJobs.map((job) => (
            <div key={job.id} className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)] hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-[var(--border-radius-sm)] object-cover border border-[var(--border-color-hover)] bg-[var(--bg-secondary)]" />
                <div className="flex flex-col gap-1.5">
                  <Link href={`/jobs/${job.id}`} className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-purple)] transition-all duration-300">
                    {job.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-4 text-[0.95rem] text-[var(--text-secondary)]">
                    <span>{job.companyName}</span>
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
                <Link href={`/jobs/${job.id}`} className="accent-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-[1100px] mx-auto w-full px-6">
        <div className="bg-gradient-to-r from-violet-500/15 to-cyan-500/15 border border-[var(--border-color-hover)] rounded-[var(--border-radius-lg)] p-10 md:p-14 grid grid-cols-1 md:grid-cols-[3fr_2fr] items-center gap-10 shadow-[var(--shadow-glass)]">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3">Accelerate Your Hiring Process</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-[1.1rem]">
              Whether you are looking to hire senior engineers or looking for your next challenge, NextHireBD provides the best matching experience.
            </p>
          </div>
          <div className="flex gap-4 justify-center md:justify-end">
            <Link href="/register?role=seeker" className="accent-btn">
              Create Profile
            </Link>
            <Link href="/register?role=recruiter" className="outline-btn">
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
