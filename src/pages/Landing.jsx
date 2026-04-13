import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { useAuthStore } from '../store/authStore';

// Obsidian Luminescence Variables from StitchMCP Design System
// bg-main: #070d1f
// bg-card: #11192e
// bg-card-hover: #171f36
// text-heading: #dfe4fe
// text-body: #a5aac2
// primary-glow: #69f6b8

const fadeInUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};
export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [billingCycle, setBillingCycle] = useState('monthly')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogoClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/')
  }

  return (
    <PageWrapper className="min-h-screen bg-[#070d1f] text-[#dfe4fe] font-sans selection:bg-[#69f6b8]/30">
      <style>{`
        html { scroll-behavior: smooth; }
        .bento-card {
          background: #11192e;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 1.5rem;
          transition: all 0.3s ease;
        }
        .bento-card:hover {
          background: #171f36;
          border-color: rgba(105, 246, 184, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }
        .obsidian-glow {
          box-shadow: inset 0 1px 0 0 rgba(105, 246, 184, 0.1), 0 0 40px -10px rgba(105, 246, 184, 0.15);
        }
        /* Custom scrollbar for comparison table */
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-track { background: #0c1326; border-radius: 8px; }
        ::-webkit-scrollbar-thumb { background: #171f36; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: #69f6b8; }
      `}</style>

      {/* Header - Fixed overlapping with z-50 and solid glass background */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#070d1f]/60 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#69f6b8] to-[#005c52] rounded-xl flex items-center justify-center obsidian-glow transition-transform duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 text-[#002919]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none uppercase">KAYAKA-AI</span>
              <span className="text-[9px] font-black text-[#69f6b8] tracking-[0.2em] mt-1 opacity-80 uppercase">Career Engine</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { name: 'Features', id: 'features' },
              { name: 'How It Works', id: 'how-it-works' },
              { name: 'Comparison', id: 'comparison' },
              { name: 'Pricing', id: 'pricing' }
            ].map((item) => (
              <a 
                key={item.name} 
                href={`#${item.id}`} 
                className="text-[#a5aac2] hover:text-[#69f6b8] font-bold transition-all text-xs uppercase tracking-widest relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#69f6b8] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:block text-[#a5aac2] hover:text-white font-bold transition-colors text-xs uppercase tracking-widest">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-[#69f6b8] text-[#002919] rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(105,246,184,0.5)] active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#69f6b8]/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <motion.div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center" initial="hidden" animate="visible" variants={staggerContainer}>
          
          <motion.div variants={fadeInUp} className="text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#11192e] border border-[#69f6b8]/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-[#69f6b8] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[#69f6b8] uppercase tracking-wider">AI-Powered Optimization</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Land Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69f6b8] to-[#00dcfd]">Dream Job</span> Faster.
            </h1>
            
            <p className="text-lg text-[#a5aac2] mb-10 leading-relaxed max-w-xl">
              Stop guessing what recruiters want. Our AI analyzes job descriptions and tailors your resume instantly. ATS-approved, highly optimized, and proven to work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/signup" className="px-8 py-4 bg-[#69f6b8] text-[#002919] rounded-xl font-bold hover:shadow-[0_0_30px_rgba(105,246,184,0.4)] transition-all text-center flex items-center justify-center gap-2">
                Start Optimizing Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
              <a href="#how-it-works" className="px-8 py-4 bg-[#11192e] border border-white/10 text-white rounded-xl font-bold hover:bg-[#171f36] transition-all text-center">
                See How It Works
              </a>
            </div>

            <div className="mt-14 flex items-center gap-10">
              <div><p className="text-4xl font-bold text-white mb-1">10k+</p><p className="text-[#a5aac2] text-sm font-medium">Happy Users</p></div>
              <div className="w-px h-10 bg-white/10"></div>
              <div><p className="text-4xl font-bold text-white mb-1">50k+</p><p className="text-[#a5aac2] text-sm font-medium">Resumes Optimized</p></div>
              <div className="w-px h-10 bg-white/10"></div>
              <div><p className="text-4xl font-bold text-[#69f6b8] mb-1">4.9</p><p className="text-[#a5aac2] text-sm font-medium">User Rating</p></div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative z-10 hidden lg:block">
            <div className="bg-[#11192e] border border-white/10 rounded-2xl p-6 shadow-2xl obsidian-glow transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div><div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div><div className="w-3 h-3 rounded-full bg-[#69f6b8]/20 border border-[#69f6b8]/50"></div></div>
                <span className="text-xs text-[#a5aac2] font-mono bg-black/40 px-3 py-1 rounded-md">Analysis Complete</span>
              </div>
              <div className="bg-[#0c1326] rounded-xl p-5 border border-white/5 mb-4 flex items-center justify-between">
                <div><p className="text-white font-bold mb-1">Match Score</p><p className="text-[#a5aac2] text-xs">Resume vs Software Engineer JD</p></div>
                <div className="text-4xl font-extrabold text-[#69f6b8]">92%</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#171f36] to-[#0c1326] p-4 rounded-xl border border-white/5">
                  <p className="text-[#69f6b8] text-xs font-bold mb-3 uppercase tracking-wider">Matching Skills</p>
                  <div className="flex flex-wrap gap-2"><span className="px-2 py-1 bg-[#69f6b8]/10 text-[#69f6b8] text-xs rounded-md">React</span><span className="px-2 py-1 bg-[#69f6b8]/10 text-[#69f6b8] text-xs rounded-md">Node.js</span></div>
                </div>
                <div className="bg-gradient-to-br from-[#171f36] to-[#0c1326] p-4 rounded-xl border border-white/5">
                  <p className="text-yellow-400 text-xs font-bold mb-3 uppercase tracking-wider">Missing Skills</p>
                  <div className="flex flex-wrap gap-2"><span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-md">Kubernetes</span></div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* Features - Bento Box Style */}
      <section id="features" className="py-24 px-6 bg-[#0c1326]/50">
        <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Built for Success.</h2>
            <p className="text-[#a5aac2] max-w-2xl mx-auto text-lg">Powerful AI tools structured entirely around getting your resume past the ATS filters and into human hands.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'AI Resume Analysis', desc: 'Instantly scan your resume for keywords, grammar, and structural flaws before you apply.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { title: 'Job Description Matching', desc: 'Paste the exact role. We calculate your match score and explicitly tell you what to fix.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { title: 'Smart Profile Editor', desc: 'Edit your data in one master profile, and instantly generate tailored variations.', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { title: 'One-Click Optimization', desc: 'Rewrite bullet points automatically to highlight impact and action verbs.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { title: 'ATS Guaranteed Format', desc: 'Download as PDF or DOCX using templates strictly verified by top recruiters.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'Secure & Private', desc: 'Your professional data is encrypted and securely stored. Delete it anytime.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="bento-card p-8 group">
                <div className="w-12 h-12 rounded-xl bg-[#69f6b8]/10 text-[#69f6b8] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#69f6b8] group-hover:text-[#002919] transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#a5aac2] leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">How It Works.</h2>
            <p className="text-[#a5aac2] text-lg">Zero configuration. Pure results.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[40px] left-10 right-10 h-px bg-white/10 z-0"></div>
            {[
              { s: '01', title: 'Upload Resume', desc: 'Drag & drop your existing PDF.' },
              { s: '02', title: 'Add Job Desc', desc: 'Paste your target role.' },
              { s: '03', title: 'AI Analysis', desc: 'We compute gaps and rewrite bullets.' },
              { s: '04', title: 'Download', desc: 'Export an ATS-friendly file.' }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto bg-[#070d1f] border-2 border-[#171f36] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl">
                  {i === 2 ? <span className="text-[#69f6b8]">{step.s}</span> : step.s}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[#a5aac2] text-sm px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Comparison Table Fix - Overflow horizontally securely */}
      <section id="comparison" className="py-24 px-6 bg-[#0c1326]/50 border-y border-white/5 relative">
        <motion.div className="max-w-6xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">How We Compare.</h2>
            <p className="text-[#a5aac2]">The market data speaks for itself.</p>
          </motion.div>
          
          <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-[#11192e]/40 backdrop-blur-sm shadow-2xl obsidian-glow">
            <div className="w-full overflow-x-auto relative">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#0c1326]/60 border-b border-white/10">
                    <th className="py-6 px-8 font-bold text-[#dfe4fe] w-1/4 sticky left-0 z-20 bg-[#0c1326] border-r border-white/5 uppercase tracking-widest text-[10px]">Capabilities</th>
                    <th className="py-6 px-8 font-bold text-[#69f6b8] relative bg-[#171f36]/80 text-center border-x border-[#69f6b8]/20">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#69f6b8] text-[#002919] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(105,246,184,0.4)] whitespace-nowrap">Value Winner</div>
                      KAYAKA-AI
                    </th>
                    <th className="py-6 px-8 font-bold text-[#a5aac2] text-center border-r border-white/5">EnhanceCV</th>
                    <th className="py-6 px-8 font-bold text-[#a5aac2] text-center border-r border-white/5">Resume.io</th>
                    <th className="py-6 px-8 font-bold text-[#a5aac2] text-center">Kickresume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Premium Templates', '21 FREE ✅', 'Paid Only', 'Paid Only', 'Limited (5)'],
                    ['AI Resume Generation', 'Unlimited ✅', '3/mo (Paid)', 'Paid Only', 'Paid Only'],
                    ['JD Match Analysis', 'Deep AI ✅', 'Keyword Only', 'Manual', 'Basic'],
                    ['PDF Downloads', 'Pro Plan 🔒', '₹999+', '₹1,200+', '₹800+'],
                    ['Smart Apply Tools', 'Elite Plan 🔒', '❌', '❌', '❌'],
                    ['Pricing (from)', '₹99/mo ✅', '₹800/mo', '₹1,000/mo', '₹600/mo']
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-5 px-8 text-[#dfe4fe] font-medium sticky left-0 z-20 bg-[#11192e] border-r border-white/5 group-hover:bg-[#171f36]">{row[0]}</td>
                      <td className="py-5 px-8 text-center text-[#69f6b8] bg-[#69f6b8]/5 font-bold border-x border-[#69f6b8]/10 group-hover:bg-[#69f6b8]/10">{row[1]}</td>
                      <td className="py-5 px-8 text-center text-[#a5aac2] border-r border-white/5">{row[2]}</td>
                      <td className="py-5 px-8 text-center text-[#a5aac2] border-r border-white/5">{row[3]}</td>
                      <td className="py-5 px-8 text-center text-[#a5aac2]">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Section Fix - Scaled Appropriately */}
      <section id="pricing" className="py-24 px-6 relative">
        <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#69f6b8]/10 border border-[#69f6b8]/20 rounded-full mb-6">
              <span className="text-[10px] font-black text-[#69f6b8] uppercase tracking-[0.2em]">Investment in your career</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Simple, Honest Pricing.</h2>
            
            {/* Premium Billing Toggle */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-[#a5aac2]'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-7 bg-[#11192e] rounded-full p-1 border border-white/10 group relative transition-all hover:border-[#69f6b8]/40"
              >
                <div className={`w-5 h-5 rounded-full bg-[#69f6b8] shadow-[0_0_10px_rgba(105,246,184,0.4)] transition-all duration-500 ease-out ${billingCycle === 'monthly' ? 'ml-0' : 'ml-7'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium transition-colors ${billingCycle === 'annual' ? 'text-white' : 'text-[#a5aac2]'}`}>Annual</span>
                <span className="bg-[#69f6b8] text-[#002919] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Save 33%</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {[
              { 
                name: 'Free', 
                price: '₹0', 
                desc: 'Perfect for exploring Kayaka.', 
                btn: 'Start Building', 
                primary: false, 
                features: ['All 21 Templates Unlocked', 'AI Resume Scan (1)', 'Basic Match Score', 'Live A4 Preview Engine'] 
              },
              { 
                name: 'Pro', 
                price: billingCycle === 'monthly' ? '₹149' : '₹99', 
                duration: '/mo',
                desc: 'Get hired 3x faster with AI.', 
                btn: 'Accelerate with Pro', 
                primary: true, 
                badge: 'Recommended',
                features: ['Unlimited AI Generation', 'Unlimited PDF Exports', 'Full ATS Optimization', 'Tailor to any Job Description', 'Application Tracker'] 
              },
              { 
                name: 'Elite', 
                price: billingCycle === 'monthly' ? '₹299' : '₹199', 
                duration: '/mo',
                desc: 'The ultimate job-hunting suite.', 
                btn: 'Unlock Everything', 
                primary: false, 
                features: ['Everything in Pro', 'Smart Apply Auto-fill', 'AI Cover Letter Generator', 'AI Interview Prep Kit', 'Weekly Job Match Digest'] 
              },
              { 
                name: 'Teams', 
                price: 'Custom', 
                desc: 'For colleges & placement cells.', 
                btn: 'Contact Sales', 
                primary: false, 
                features: ['Bulk Admin Seats', 'Placement Analytics', 'College HR Dashboard', 'White-labeled Templates', 'Dedicated Onboarding'] 
              }
            ].map((plan, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                className={`flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                  plan.primary 
                    ? 'border-[#69f6b8]/40 bg-[#171f36] relative z-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),0_0_40px_rgba(105,246,184,0.1)]' 
                    : 'border-white/5 bg-[#11192e] hover:bg-[#171f36]/80'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#69f6b8] text-[#002919] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(105,246,184,0.3)] whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                
                <h3 className="text-xl font-extrabold text-white mb-2">{plan.name}</h3>
                <p className="text-[#a5aac2] text-[12px] mb-8 leading-relaxed opacity-80">{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.duration && <span className="text-[#a5aac2] text-sm font-medium">{plan.duration}</span>}
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.primary ? 'bg-[#69f6b8]/20 text-[#69f6b8]' : 'bg-white/5 text-white/40'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span className="text-[12px] text-[#dfe4fe] opacity-80 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to={plan.name === 'Teams' ? 'mailto:sales@kayaka-ai.com' : '/signup'} 
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all duration-300 text-xs uppercase tracking-widest ${
                    plan.primary 
                      ? 'bg-[#69f6b8] text-[#002919] hover:shadow-[0_0_25px_rgba(105,246,184,0.5)] active:scale-95' 
                      : 'bg-[#070d1f] text-white border border-white/10 hover:bg-white/5 hover:border-white/20 active:scale-95'
                  }`}
                >
                  {plan.btn}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.p variants={fadeInUp} className="text-center mt-12 text-[#a5aac2] text-xs opacity-60">
            Secure checkout powered by Razorpay. Prices inclusive of all taxes.
          </motion.p>
        </motion.div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="border-t border-white/5 bg-[#070d1f] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-8 h-8 bg-gradient-to-br from-[#69f6b8] to-[#005c52] rounded-lg flex items-center justify-center obsidian-glow">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">KAYAKA-AI</span>
            </div>
            <p className="text-[#a5aac2] text-sm leading-relaxed max-w-sm mb-6">
              The ultimate AI-powered resume optimization engine. Land your dream job faster by beating the ATS and standing out to recruiters.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Pricing</a></li>
              <li><a href="#comparison" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Compare Competitors</a></li>
              <li><Link to="/signup" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Create Resume</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/login" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy-policy" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link to="/data-deletion" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Data Deletion</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#a5aac2] text-sm">© {new Date().getFullYear()} KAYAKA-AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-sm text-[#a5aac2]">
              <span className="w-2 h-2 rounded-full bg-[#69f6b8] animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
