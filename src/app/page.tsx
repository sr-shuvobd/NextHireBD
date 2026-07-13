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
import styles from './page.module.css';

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
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>
          <Sparkles size={16} />
          <span>Next Generation Job Search Platform</span>
        </div>
        
        <h1 className={styles.heroTitle}>
          Discover the Future of <br />
          <span className="gradient-text">Tech Careers</span> in Bangladesh
        </h1>
        
        <p className={styles.heroSubtitle}>
          NextHireBD connects top developers, creative designers, and tech leaders with remote, hybrid, and onsite roles at world-class companies.
        </p>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <div className={styles.inputWrapper}>
              <Search size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Job Title, Skills, or Company..." 
                className={styles.input}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className={styles.inputWrapper}>
              <MapPin size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="City, Country or Remote..." 
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.searchBtn}>
              <span>Search Jobs</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Popular Categories</h2>
            <p className={styles.sectionSubtitle}>Explore matching roles based on your domain expertise</p>
          </div>
          <Link href="/jobs" className="outline-btn" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={styles.categoryCard}
              onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className={styles.iconWrapper}>{cat.icon}</div>
              <div>
                <div className={styles.catName}>{cat.name}</div>
                <div className={styles.catCount}>{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
            <p className={styles.sectionSubtitle}>Top jobs hand-picked for quality and relevance</p>
          </div>
          <Link href="/jobs" className="outline-btn" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            <span>Find More Jobs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.jobList}>
          {featuredJobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobInfo}>
                <img src={job.companyLogo} alt={job.companyName} className={styles.companyLogo} />
                <div className={styles.jobDetails}>
                  <Link href={`/jobs/${job.id}`} className={styles.jobTitle}>
                    {job.title}
                  </Link>
                  <div className={styles.companyMeta}>
                    <span>{job.companyName}</span>
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
                <Link href={`/jobs/${job.id}`} className="accent-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <div>
            <h2 className={styles.ctaTitle}>Accelerate Your Hiring Process</h2>
            <p className={styles.ctaText}>
              Whether you are looking to hire senior engineers or looking for your next challenge, NextHireBD provides the best matching experience.
            </p>
          </div>
          <div className={styles.ctaButtons}>
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
