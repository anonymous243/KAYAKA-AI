import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

// Obsidian Luminescence Architecture
const fadeInUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

export default function About() {
  return (
    <PageWrapper className="min-h-screen bg-[#070d1f] text-[#dfe4fe] font-sans selection:bg-[#69f6b8]/30">
      <style>{`
        html { scroll-behavior: smooth; }
        .obsidian-glow {
          box-shadow: inset 0 1px 0 0 rgba(105, 246, 184, 0.1), 0 0 40px -10px rgba(105, 246, 184, 0.15);
        }
        .bento-card {
          background: #11192e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          transition: all 0.3s ease;
        }
        .bento-card:hover {
          background: #171f36;
          border-color: rgba(105, 246, 184, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* Header synchronized with Landing */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#070d1f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#69f6b8] to-[#005c52] rounded-xl flex items-center justify-center obsidian-glow">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white hover:text-[#69f6b8] transition-colors">KAYAKA-AI</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-[#a5aac2] hover:text-[#69f6b8] font-medium transition-colors text-sm">Home</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[#a5aac2] hover:text-white font-medium transition-colors text-sm">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-[#69f6b8] text-[#002919] rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(105,246,184,0.3)] transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#69f6b8]/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <motion.div className="max-w-4xl mx-auto text-center relative z-10" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#11192e] border border-[#69f6b8]/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#69f6b8] rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-[#69f6b8] uppercase tracking-wider">Mission Control</span>
          </motion.div>
          
          <motion.h1 className="text-4xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight" variants={fadeInUp}>
            Empowering Job Seekers <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69f6b8] to-[#00dcfd]">Worldwide</span>
          </motion.h1>
          
          <motion.p className="text-xl text-[#a5aac2] mb-10 leading-relaxed max-w-2xl mx-auto" variants={fadeInUp}>
            We're on a mission to democratize hiring. We build architecture that puts maximum leverage back into the hands of qualified candidates by breaking through ATS firewalls and forcing recruiter visibility.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0c1326]/50">
        <motion.div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 tracking-tight">The Origin Sequence</h2>
            <div className="space-y-6 text-[#a5aac2] text-lg leading-relaxed">
              <p>
                KAYAKA-AI was born from a simple logic anomaly: highly-talented engineers and operators were getting automatically rejected not because they lacked skills, but because they lacked a 1:1 structural alignment with specific ATS parsers.
              </p>
              <p className="pl-6 border-l-2 border-[#69f6b8]/50 italic">
                "We watched black-box Applicant Tracking Systems indiscriminately delete 75% of perfectly qualified candidates before a human ever saw them. We realized manual tailoring was no longer computationally viable."
              </p>
              <p>
                So we built KAYAKA-AI. A pure, AI-powered parsing engine utilizing hyper-advanced modeling to instantly reshape, rewrite, and realign your professional history directly into the exact data structures Recruiters and Algorithms prioritize.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#69f6b8] to-[#00dcfd] rounded-3xl blur-[80px] opacity-10"></div>
            <div className="bento-card p-12 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-[400px] relative z-10 obsidian-glow">
              <div className="w-24 h-24 bg-[#070d1f] rounded-full flex items-center justify-center mb-6 border border-[#69f6b8]/30 shadow-[0_0_30px_rgba(105,246,184,0.2)]">
                <svg className="w-10 h-10 text-[#69f6b8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Deployed 2024</h3>
              <p className="text-[#a5aac2]">Operating globally to bypass the algorithmic sorting filters.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Values Bento */}
      <section className="py-24 px-6 border-y border-white/5">
        <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Core Principles</h2>
            <p className="text-[#a5aac2] text-lg">The underlying logic driving our architecture.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', title: 'Democratize Opportunity', desc: 'No one should be gated out of a life-changing role just because they couldn\'t effectively format a PDF table.' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Algorithmic Leverage', desc: 'We utilize state-of-the-art NLP models to instantly parse keyword density requirements from dense corporate JDs.' },
              { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: 'User Success Matrix', desc: 'Every line of code shipped is strictly measured against one metric: user interview conversion rates.' }
            ].map((val, i) => (
              <motion.div key={i} variants={fadeInUp} className="bento-card p-8 group">
                <div className="w-12 h-12 rounded-xl bg-[#171f36] border border-white/10 text-white flex items-center justify-center mb-6 group-hover:bg-[#69f6b8] group-hover:text-[#002919] transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={val.icon}/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{val.title}</h3>
                <p className="text-[#a5aac2] text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Board */}
      <section className="py-20 px-6 bg-[#69f6b8]/5 border-b border-white/5 text-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {[
            { val: '10k+', label: 'Active Deployments' },
            { val: '50k+', label: 'Engines Optimized' },
            { val: '4.9', label: 'Satisfaction Quotient' },
            { val: '2.5k', label: 'Hiring Companies' }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="bg-[#11192e]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#69f6b8] mb-2">{stat.val}</div>
              <div className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Engineering Team */}
      <section className="py-24 px-6 relative">
        <motion.div className="max-w-6xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Architects & Engineers</h2>
            <p className="text-[#a5aac2] text-lg">The individuals building the machine.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: 'Core Engine', desc: 'Developing the generative LLM pipeline.' },
              { role: 'Interface Design', desc: 'Crafting frictionless Obsidian interfaces.' },
              { role: 'Ops & Success', desc: 'Ensuring global uptime and user scaling.' }
            ].map((team, i) => (
              <motion.div key={i} variants={fadeInUp} className="bento-card p-8 flex flex-col justify-center text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#171f36] border border-[#69f6b8]/30 flex items-center justify-center mb-4 text-[#69f6b8]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm8 14h-1v-2c0-2.206-1.794-4-4-4H9c-2.206 0-4 1.794-4 4v2H4v-2c0-2.757 2.243-5 5-5h6c2.757 0 5 2.243 5 5v2z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{team.role}</h3>
                <p className="text-[#a5aac2] text-sm">{team.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Synchronized Footer from Landing (Excluding Careers, Blog, Contact) */}
      <footer className="border-t border-white/5 bg-[#070d1f] pt-20 pb-10 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#69f6b8] to-[#005c52] rounded-lg flex items-center justify-center obsidian-glow">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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
              <li><Link to="/signup" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Create Resume</Link></li>
              <li><Link to="/login" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#a5aac2] hover:text-[#69f6b8] text-sm transition-colors">Terms of Service</Link></li>
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
