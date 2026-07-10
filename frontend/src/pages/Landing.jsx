import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  FolderKanban,
  Github,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Play,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import "./Landing.css";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const navItems = ["Home", "Features", "Dashboard", "Pricing", "About", "Contact"];

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Create projects, assign deadlines, track progress and organize every deliverable.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Manage all client information, project history and communication from one place.",
  },
  {
    icon: Wallet,
    title: "Payment Dashboard",
    description: "Track advances, pending payments, completed transactions and monthly income automatically.",
  },
  {
    icon: Receipt,
    title: "Invoice Generator",
    description: "Generate professional invoices in seconds and share them directly with clients.",
  },
  {
    icon: CalendarClock,
    title: "Meeting Scheduler",
    description: "Manage meetings with Google Calendar integration and never miss an important client call.",
  },
  {
    icon: BellRing,
    title: "Deadline & Reminder System",
    description: "Receive smart reminders and stay ahead of project deadlines.",
  },
];

const steps = [
  { icon: Plus, title: "Create Project", copy: "Start with the client, timeline, budget and deliverables in one focused flow." },
  { icon: LayoutDashboard, title: "Manage Clients & Work", copy: "Track meetings, reminders, invoices and progress from the same command center." },
  { icon: CreditCard, title: "Get Paid", copy: "See pending balances, sent invoices and monthly income without chasing spreadsheets." },
];

const benefits = [
  { icon: TimerReset, title: "Save Time", copy: "Replace tab switching with one calm workspace." },
  { icon: Zap, title: "Increase Productivity", copy: "Prioritize the next action across every client." },
  { icon: Bell, title: "Never Miss Deadlines", copy: "Keep meetings, reminders and due dates visible." },
  { icon: ShieldCheck, title: "Organize Every Client", copy: "Bring context, history and money into one view." },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Product Designer",
    initials: "AM",
    review: "SoloSync finally gives my freelance work the same polish my clients expect from their own product teams.",
  },
  {
    name: "Maya Reynolds",
    role: "Full-stack Developer",
    initials: "MR",
    review: "Projects, invoices and meeting notes live together now. My weekly admin time dropped almost immediately.",
  },
  {
    name: "Leo Carter",
    role: "Brand Strategist",
    initials: "LC",
    review: "It feels fast, quiet and intentional. I can see who owes what, what is due, and what needs attention.",
  },
];

const dashboardNav = [
  "Dashboard",
  "Projects",
  "Payments",
  "Invoices",
  "Meetings",
  "Deadlines",
  "Reminders",
  "Profile",
];

function BrandMark() {
  return (
    <Link className="landing-brand" to="/" aria-label="SoloSync home">
      <span className="landing-brand__mark">S</span>
      <span>Solo<span>Sync</span></span>
    </Link>
  );
}

function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="landing-nav"
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease }}
    >
      <BrandMark />
      <nav className="landing-nav__links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item} href={item === "Home" ? "#home" : `#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>
      <div className="landing-nav__actions">
        <Link className="landing-btn landing-btn--ghost" to="/login">Login</Link>
        <Link className="landing-btn landing-btn--primary" to="/signup">
          Get Started
          <ArrowRight size={16} />
        </Link>
      </div>
      <button className="landing-nav__menu" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="landing-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="landing-mobile__panel">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
              {navItems.map((item) => (
                <a key={item} href={item === "Home" ? "#home" : `#${item.toLowerCase()}`} onClick={() => setOpen(false)}>
                  {item}
                </a>
              ))}
              <Link className="landing-btn landing-btn--primary" to="/signup">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MiniDashboard({ compact = false }) {
  const metrics = [
    ["Monthly Income", "$18.4k", TrendingUp],
    ["Pending Payments", "$4.8k", Wallet],
    ["Upcoming Meetings", "07", CalendarClock],
  ];

  return (
    <motion.div
      className={compact ? "mini-dashboard mini-dashboard--compact" : "mini-dashboard"}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mini-dashboard__topbar">
        <div className="mini-dashboard__traffic"><span /><span /><span /></div>
        <div className="mini-dashboard__search"><Search size={14} /> Search workspace</div>
        <Settings size={16} />
      </div>
      <div className="mini-dashboard__body">
        <aside className="mini-dashboard__sidebar">
          <BrandMark />
          {dashboardNav.map((item, index) => (
            <div key={item} className={index === 0 ? "active" : ""}>
              <ChevronRight size={14} />
              {item}
            </div>
          ))}
        </aside>
        <div className="mini-dashboard__main">
          <div className="mini-dashboard__header">
            <div>
              <span className="eyebrow">Today</span>
              <h3>Current Projects</h3>
            </div>
            <button type="button"><Plus size={15} /> Quick Action</button>
          </div>
          <div className="metric-grid">
            {metrics.map(([label, value, Icon]) => (
              <div className="metric-card" key={label}>
                <Icon size={18} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="workspace-grid">
            <div className="panel panel--wide">
              <div className="panel__title"><span>Project Progress</span><strong>72%</strong></div>
              <div className="progress-row"><span style={{ width: "82%" }} /></div>
              <div className="progress-row"><span style={{ width: "64%" }} /></div>
              <div className="progress-row"><span style={{ width: "48%" }} /></div>
            </div>
            <div className="panel">
              <div className="panel__title"><span>Invoice Status</span><strong>Sent</strong></div>
              <div className="donut" />
            </div>
            <div className="panel">
              <div className="panel__title"><span>Calendar Widget</span><Clock3 size={16} /></div>
              <div className="calendar-dots">
                {Array.from({ length: 14 }).map((_, index) => <span key={index} className={index % 5 === 0 ? "active" : ""} />)}
              </div>
            </div>
            <div className="panel panel--activity">
              <div className="panel__title"><span>Recent Activity</span><MessageSquare size={16} /></div>
              <p>Invoice shared with Nova Studio</p>
              <p>Reminder created for Beta Labs</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="home" className="landing-hero">
      <div className="landing-hero__backdrop" />
      <motion.div className="landing-hero__copy" variants={stagger} initial="hidden" animate="visible">
        <motion.span className="landing-pill" variants={fadeUp}>
          <Sparkles size={15} /> One Workspace. Every Client. Complete Control.
        </motion.span>
        <motion.h1 variants={fadeUp}>Manage Freelance Work Without the Chaos.</motion.h1>
        <motion.p variants={fadeUp}>
          Track projects, manage clients, monitor payments, schedule meetings, generate invoices,
          organize deadlines, and grow your freelance business all from one powerful workspace.
        </motion.p>
        <motion.div className="landing-hero__actions" variants={fadeUp}>
          <Link className="landing-btn landing-btn--primary landing-btn--large" to="/signup">
            Get Started Free <ArrowRight size={18} />
          </Link>
          <button className="landing-btn landing-btn--soft landing-btn--large" type="button">
            <Play size={18} /> Watch Demo
          </button>
        </motion.div>
        <motion.div className="landing-hero__checks" variants={fadeUp}>
          <span><CheckCircle2 size={16} /> No credit card required</span>
          <span><CheckCircle2 size={16} /> Built for freelancers</span>
        </motion.div>
      </motion.div>
      <motion.div className="landing-hero__visual" initial={{ opacity: 0, x: 42 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.25, ease }}>
        <MiniDashboard />
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="landing-section">
      <SectionHeading
        title="Everything You Need To Run Your Freelance Business"
        subtitle="Designed specifically for freelancers, agencies, developers, designers and creators."
      />
      <motion.div className="feature-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        {features.map(({ icon: Icon, title, description }) => (
          <motion.article className="landing-card feature-card" variants={fadeUp} key={title} whileHover={{ y: -8 }}>
            <span className="icon-tile"><Icon size={22} /></span>
            <h3>{title}</h3>
            <p>{description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <motion.div className="section-heading" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      <motion.p variants={fadeUp}>{subtitle}</motion.p>
    </motion.div>
  );
}

function Workflow() {
  return (
    <section id="about" className="landing-section landing-section--band">
      <SectionHeading title="How SoloSync Works" subtitle="A simple workflow from first client brief to final payment." />
      <div className="workflow">
        <div className="workflow__line" />
        {steps.map(({ icon: Icon, title, copy }, index) => (
          <motion.article className="workflow-step" key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
            <span><Icon size={22} /></span>
            <small>Step {index + 1}</small>
            <h3>{title}</h3>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  const cards = [
    ["Analytics", BarChart3, "+24% growth"],
    ["Active Projects", FolderKanban, "12 live"],
    ["Payment Charts", Wallet, "$18.4k"],
    ["Calendar", CalendarClock, "4 calls"],
    ["Meetings", Users, "3 today"],
    ["Invoice List", FileText, "8 sent"],
    ["Client Overview", MessageSquare, "26 clients"],
    ["Productivity Stats", Zap, "91% focus"],
  ];

  return (
    <section id="dashboard" className="landing-section showcase">
      <SectionHeading
        title="A Dashboard Built Around Real Freelance Work"
        subtitle="Analytics, projects, payment charts, calendar, meetings, invoices, clients and productivity signals in one elegant view."
      />
      <motion.div className="showcase__frame" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.75, ease }}>
        <MiniDashboard compact />
        <div className="showcase__cards">
          {cards.map(([label, Icon, value], index) => (
            <motion.div className="showcase-card" key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, ease }}>
              <Icon size={18} />
              <span>{label}</span>
              <strong>{value}</strong>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="landing-section landing-section--compact">
      <div className="benefit-grid">
        {benefits.map(({ icon: Icon, title, copy }) => (
          <motion.article className="benefit-card" key={title} whileHover={{ y: -6 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section id="pricing" className="landing-section landing-section--compact">
      <motion.div className="pricing-teaser landing-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div>
          <span className="landing-pill">Simple pricing</span>
          <h2>Start free. Upgrade when your freelance business is ready.</h2>
        </div>
        <Link className="landing-btn landing-btn--primary" to="/signup">Start Free Today <ArrowRight size={16} /></Link>
      </motion.div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="contact" className="landing-section">
      <SectionHeading title="Loved by Freelancers" subtitle="Built for people who need clarity across projects, people, payments and time." />
      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <motion.article className="landing-card testimonial-card" key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.1 }}>
            <div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
            <p>"{item.review}"</p>
            <div className="testimonial-card__person">
              <span>{item.initials}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.role}</small>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="landing-section landing-section--compact">
      <motion.div className="final-cta" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, ease }}>
        <span className="landing-pill">Ready to Simplify Freelancing?</span>
        <h2>Ready to Simplify Freelancing?</h2>
        <p>Join SoloSync today and manage projects, clients, invoices, meetings and payments from one beautiful workspace.</p>
        <Link className="landing-btn landing-btn--primary landing-btn--large" to="/signup">Start Free Today <ArrowRight size={18} /></Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  const columns = [
    ["Product", ["Features", "Dashboard", "Pricing"]],
    ["Resources", ["Documentation", "GitHub", "Support"]],
    ["Company", ["About", "Contact"]],
  ];

  return (
    <footer className="landing-footer">
      <div className="landing-footer__brand">
        <BrandMark />
        <p>SoloSync brings projects, clients, meetings, invoices and payments into one focused workspace.</p>
      </div>
      {columns.map(([title, links]) => (
        <div className="landing-footer__column" key={title}>
          <h3>{title}</h3>
          {links.map((item) => (
            <a key={item} href={item === "GitHub" ? "https://github.com" : `#${item.toLowerCase()}`}>
              {item}{item === "GitHub" && <Github size={14} />}
            </a>
          ))}
        </div>
      ))}
      <div className="landing-footer__bottom">© 2026 SoloSync. Built for Freelancers.</div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Showcase />
        <Benefits />
        <PricingTeaser />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
