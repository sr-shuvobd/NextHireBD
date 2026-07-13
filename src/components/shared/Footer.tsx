'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Globe, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Briefcase size={28} color="#8b5cf6" />
            <span>NextHire<span style={{ color: '#06b6d4' }}>BD</span></span>
          </div>
          <p className={styles.desc}>
            Empowering tech talent and connecting top recruiters across Bangladesh and globally. Discover your dream role today.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon}><Globe size={18} /></a>
            <a href="#" className={styles.socialIcon}><Mail size={18} /></a>
          </div>
        </div>

        {/* Links: Seekers */}
        <div>
          <h4 className={styles.title}>For Job Seekers</h4>
          <div className={styles.links}>
            <Link href="/jobs" className={styles.link}>Browse Jobs</Link>
            <Link href="/dashboard/seeker" className={styles.link}>Candidate Dashboard</Link>
            <Link href="/jobs?workType=remote" className={styles.link}>Remote Jobs</Link>
            <Link href="/jobs?category=Tech" className={styles.link}>Tech Jobs</Link>
          </div>
        </div>

        {/* Links: Recruiters */}
        <div>
          <h4 className={styles.title}>For Recruiters</h4>
          <div className={styles.links}>
            <Link href="/login?role=recruiter" className={styles.link}>Post a Job</Link>
            <Link href="/register?role=recruiter" className={styles.link}>Recruiter Sign Up</Link>
            <Link href="#" className={styles.link}>Talent Search</Link>
            <Link href="#" className={styles.link}>Pricing Plans</Link>
          </div>
        </div>

        {/* Links: Company */}
        <div>
          <h4 className={styles.title}>Company</h4>
          <div className={styles.links}>
            <a href="#" className={styles.link}>About Us</a>
            <a href="#" className={styles.link}>Careers</a>
            <a href="#" className={styles.link}>Terms & Conditions</a>
            <a href="#" className={styles.link}>Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} NextHireBD. All rights reserved.</p>
        <p>Built with ❤️ for University Final Project</p>
      </div>
    </footer>
  );
}
