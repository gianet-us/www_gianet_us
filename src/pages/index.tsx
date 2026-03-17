import {type ReactNode, useEffect, useRef, useState, useCallback} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ── Obfuscated email assembler (never a literal string in the markup) ────── */

function getEmail(): string {
  const p = ['\x68\x65\x6c\x6c\x6f', '\x40', '\x67\x69\x61\x6e\x65\x74', '\x2e\x75\x73'];
  return p.join('');
}

/* ── Scroll-triggered fade-in hook ──────────────────────────────────────────── */

function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          observer.unobserve(el);
        }
      },
      {threshold: 0.15},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Animated counter ───────────────────────────────────────────────────────── */

function AnimatedNumber({
  value,
  suffix = '',
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      {threshold: 0.5},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ── SVG icons ──────────────────────────────────────────────────────────────── */

function IconInfra() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
      <line x1="10" y1="6" x2="18" y2="6" />
      <line x1="10" y1="18" x2="18" y2="18" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
      <path d="M12 2l7 4v5c0 5.25-3.5 8.75-7 10-3.5-1.25-7-4.75-7-10V6l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
      <path d="M6.5 19a4.5 4.5 0 0 1-.42-8.98A7 7 0 0 1 18.42 8 4 4 0 0 1 18 16H6.5z" />
      <line x1="8" y1="19" x2="8" y2="22" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="16" y1="19" x2="16" y2="22" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 4 0 4 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-4 0-4" />
    </svg>
  );
}

/* ── Canvas email renderer ──────────────────────────────────────────────────── */

function EmailCanvas({onClick}: {onClick: () => void}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const text = getEmail();

    // Measure with a temporary context to get the right width
    const fontSize = Math.min(22, window.innerWidth * 0.045);
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const padding = 16;

    // Size the canvas
    const w = textWidth + padding * 2;
    const h = fontSize + padding;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Draw text with gradient fill
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#59d9a4');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillText(text, w / 2, h / 2);
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <button
      type="button"
      className={styles.contactStrip}
      onClick={onClick}
      aria-label="Contact us by email">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.contactIcon}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4l-10 8L2 4" />
      </svg>
      <canvas ref={canvasRef} className={styles.contactCanvas} />
      <span className={styles.contactArrow}>&#8594;</span>
    </button>
  );
}

/* ── Email copy modal ───────────────────────────────────────────────────────── */

function EmailModal({open, onClose}: {open: boolean; onClose: () => void}) {
  const [copied, setCopied] = useState(false);
  const email = getEmail();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.modalIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.modalIcon}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4l-10 8L2 4" />
          </svg>
        </div>

        <Heading as="h3" className={styles.modalTitle}>
          Get in Touch
        </Heading>
        <p className={styles.modalDesc}>
          Copy our email address and send us a message.
        </p>

        <div className={styles.modalEmailRow}>
          <code className={styles.modalEmail}>{email}</code>
          <button
            type="button"
            className={clsx(styles.modalCopyBtn, copied && styles.modalCopyBtnDone)}
            onClick={handleCopy}>
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section data ───────────────────────────────────────────────────────────── */

type ProjectItem = {
  logo: string;
  logoAlt: string;
  region: string;
  title: string;
  url: string;
  description: string;
  ctaText: string;
};

const projects: ProjectItem[] = [
  {
    logo: '/img/codyops-white-transparent.png',
    logoAlt: 'CodyOps Latin America',
    region: 'Latin America',
    title: 'CodyOps Americas',
    url: 'https://www.codyops.com',
    description:
      'An educational ecosystem empowering Latin America through specialized training in programming and advanced IT operations since 2022.',
    ctaText: 'Visit CodyOps',
  },
  {
    logo: '/img/codyops-white-transparent.png',
    logoAlt: 'CodyOps Brazil',
    region: 'Brazil',
    title: 'CodyOps Brazil',
    url: 'https://www.codyops.com.br',
    description:
      'CodyOps tailored for Brazil — high-quality curriculum in Portuguese, built to empower Brazilian tech professionals in IT operations.',
    ctaText: 'Visit CodyOps Brazil',
  },
  {
    logo: '/img/codyops-white-transparent.png',
    logoAlt: 'CodyOps Spain',
    region: 'Spain',
    title: 'CodyOps Spain',
    url: 'https://www.codyops.com.es',
    description:
      'CodyOps for Spain — specialized programming and IT operations training for Spanish professionals looking to grow their careers.',
    ctaText: 'Visit CodyOps Spain',
  },
];

type ServiceItem = {
  icon: ReactNode;
  title: string;
  description: string;
  span?: 'wide';
};

const services: ServiceItem[] = [
  {
    icon: <IconInfra />,
    title: 'Infrastructure & DevOps',
    description:
      'Design and automate scalable infrastructure with Ansible, Terraform, containers, and CI/CD pipelines tailored to your environment.',
    span: 'wide',
  },
  {
    icon: <IconShield />,
    title: 'Security & Compliance',
    description:
      'Harden systems, implement access controls, and build compliance-ready architectures for on-premise and cloud workloads.',
  },
  {
    icon: <IconCloud />,
    title: 'Cloud & Hybrid',
    description:
      'Migrate, architect, and optimize workloads across public clouds and private data centers with a focus on cost and reliability.',
  },
  {
    icon: <IconRocket />,
    title: 'Project Delivery',
    description:
      'End-to-end ownership of internal and client projects — from requirements to production, fully documented.',
    span: 'wide',
  },
];

/* ── Components ─────────────────────────────────────────────────────────────── */

function HeroSection({onContact}: {onContact: () => void}) {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.meshBg} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.heroInner}>
        <span className={styles.pill}>IT Consulting & Open Source</span>
        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.gradientText}>{siteConfig.title}</span>
        </Heading>
        <p className={styles.heroSub}>
          Reliable infrastructure, modern tooling, and expert consulting —{' '}
          <strong>make your projects great again.</strong>
        </p>
        <EmailCanvas onClick={onContact} />
        <div className={styles.heroCta}>
          <Link className={clsx('button button--lg', styles.btnPrimary)} to="/docs/">
            Browse Docs
          </Link>
          <Link className={clsx('button button--lg', styles.btnGhost)} to="/blog/">
            Read the Blog
          </Link>
        </div>
      </div>
      {/* Floating shapes */}
      <div className={clsx(styles.floater, styles.floater1)} aria-hidden="true" />
      <div className={clsx(styles.floater, styles.floater2)} aria-hidden="true" />
      <div className={clsx(styles.floater, styles.floater3)} aria-hidden="true" />
    </header>
  );
}

function ServicesSection() {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section ref={ref} className={clsx(styles.section, styles.fadeIn)}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.pillDark}>Services</span>
          <Heading as="h2" className={styles.sectionTitle}>
            What We Do
          </Heading>
          <p className={styles.sectionSub}>
            We build and maintain technology solutions — both for our own
            portfolio and for clients who need a trusted technical partner.
          </p>
        </div>
        <div className={styles.bento}>
          {services.map((s) => (
            <div
              key={s.title}
              className={clsx(styles.card, s.span === 'wide' && styles.cardWide)}>
              <div className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.cardContent}>
                {s.icon}
                <Heading as="h3" className={styles.cardTitle}>
                  {s.title}
                </Heading>
                <p className={styles.cardDesc}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section ref={ref} className={clsx(styles.statsSection, styles.fadeIn)}>
      <div className="container">
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              <AnimatedNumber value={10} suffix="+" />
            </span>
            <span className={styles.statLabel}>Open Source Projects</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>
              <AnimatedNumber value={50} suffix="+" />
            </span>
            <span className={styles.statLabel}>Ansible Roles</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>
              <AnimatedNumber value={100} suffix="%" />
            </span>
            <span className={styles.statLabel}>Documented</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section ref={ref} className={clsx(styles.projectsSection, styles.fadeIn)}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.pillDark}>Projects</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Our Projects
          </Heading>
          <p className={styles.sectionSub}>
            Open source and educational initiatives built and maintained by GiaNet.
          </p>
        </div>
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <div key={project.title} className={styles.projectCard}>
              <div className={styles.projectGlow} aria-hidden="true" />
              <div className={styles.projectCardInner}>
                <div className={styles.projectLogoWrap}>
                  <img
                    src={project.logo}
                    alt={project.logoAlt}
                    className={styles.projectLogo}
                    loading="lazy"
                  />
                </div>
                <span className={styles.projectBadge}>{project.region}</span>
                <Heading as="h3" className={styles.projectTitle}>
                  {project.title}
                </Heading>
                <p className={styles.projectDesc}>{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx('button', styles.btnProject)}>
                  {project.ctaText}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function Home(): ReactNode {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Layout
      title="Home | Giacchetta Networks"
      description="Giacchetta Networks — IT consulting, infrastructure automation, and open source projects.">
      <HeroSection onContact={() => setModalOpen(true)} />
      <main>
        <ServicesSection />
        <StatsSection />
        <ProjectsSection />
      </main>
      <EmailModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
