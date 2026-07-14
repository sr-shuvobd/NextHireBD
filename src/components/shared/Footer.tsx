'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090b] border-t border-white/8 px-6 py-12 text-[#94a3b8] text-[0.95rem] mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            <Briefcase size={28} color="#8b5cf6" />
            <span>NextHire<span style={{ color: '#06b6d4' }}>BD</span></span>
          </div>
          <p className="leading-relaxed">
            Empowering tech talent and connecting top recruiters across Bangladesh and globally. Discover your dream role today.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/8 bg-white/[0.02] flex items-center justify-center text-[#94a3b8] transition-all duration-300 hover:text-white hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/25 hover:-translate-y-1"><Globe size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/8 bg-white/[0.02] flex items-center justify-center text-[#94a3b8] transition-all duration-300 hover:text-white hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/25 hover:-translate-y-1"><Mail size={18} /></a>
          </div>
        </div>

        {/* Links: Seekers */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-[1.1rem]">For Job Seekers</h4>
          <div className="flex flex-col gap-3">
            <Link href="/jobs" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Browse Jobs</Link>
            <Link href="/dashboard/seeker" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Candidate Dashboard</Link>
            <Link href="/jobs?workType=remote" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Remote Jobs</Link>
            <Link href="/jobs?category=Tech" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Tech Jobs</Link>
          </div>
        </div>

        {/* Links: Recruiters */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-[1.1rem]">For Recruiters</h4>
          <div className="flex flex-col gap-3">
            <Link href="/login?role=recruiter" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Post a Job</Link>
            <Link href="/register?role=recruiter" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Recruiter Sign Up</Link>
            <Link href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Talent Search</Link>
            <Link href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Pricing Plans</Link>
          </div>
        </div>

        {/* Links: Company */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-[1.1rem]">Company</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">About Us</a>
            <a href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Careers</a>
            <a href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Terms & Conditions</a>
            <a href="#" className="text-[#94a3b8] transition-all duration-300 hover:text-white hover:translate-x-1">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-6 border-t border-white/8 text-center text-[0.85rem]">
        <p>&copy; {new Date().getFullYear()} NextHireBD. All rights reserved.</p>
      </div>
    </footer>
  );
}
