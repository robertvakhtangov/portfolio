import { useEffect, useId, useRef, useState } from "react";
import "./App.css";
import headshot from "./assets/headshot-cutout.webp";

// ---- Edit your content here ------------------------------------------------
const profile = {
  name: "Robert Vakhtangov",
  brand: "RobVak",
  role: "Software Engineer",
  tagline:
    "I build thoughtful, fast web experiences — from clean interfaces to the systems behind them.",
  email: "robertvakhtangov@gmail.com",
  github: "https://github.com/robertvakhtangov",
  linkedin: "https://www.linkedin.com/in/robert-vakhtangov-4684551a0/",
};

const about = [
  "I'm a developer who enjoys turning ideas into polished, usable products. I care about the details: performance, accessibility, and interfaces that feel good to use.",
  "Lately I've been exploring creative coding and 3D on the web with Three.js.",
];

const skills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Three.js", "SQL", "Git"];

const experience = [
  {
    company: "EPAM Systems",
    role: "Software Engineer",
    years: "2025",
    dates: "Mar 2025 – Aug 2025",
    highlights: [
      "Delivered features for client web platforms serving large user bases and high-volume data flows.",
      "Hardened auth, input validation, and data handling to enterprise security standards.",
    ],
  },
  {
    company: "ExactPro",
    role: "Front-End Developer",
    years: "2022 – 2025",
    dates: "Oct 2022 – Jan 2025",
    highlights: [
      "Built and shipped features for a live stock trading platform in JavaScript.",
      "Audited the legacy codebase, fixing 15+ vulnerabilities; kept 20+ components accessible.",
    ],
  },
  {
    company: "Ilia State University",
    role: "Adjunct Professor, Computer Science",
    years: "2024",
    dates: "Mar 2024 – Jul 2024",
    highlights: [
      "Taught Systems Programming to 25 students, based on CMU's CS:APP.",
      "Designed weekly labs on memory management, assembly, and low-level systems.",
    ],
  },
  {
    company: "LTD Iubar",
    role: "Full-Stack Developer",
    years: "2020",
    dates: "May 2020 – Oct 2020",
    highlights: [
      "Built PHP analytics tools integrating e-commerce APIs.",
      "Automated price and stock monitoring, cutting manual tracking time by ~60%.",
    ],
  },
  {
    company: "Murtsku",
    role: "Front-End Developer",
    years: "2019",
    dates: "Apr 2019 – Oct 2019",
    highlights: [
      "Built a React study platform for Georgian university entrance exams, used by 500+ students.",
    ],
  },
];

const education = [
  {
    school: "Villanova University",
    degree: "M.S. Computer Science",
    years: "Expected 2027",
    location: "Villanova, PA",
    notes: ["GPA 3.95", "Tuition Scholar", "UTS Technician"],
  },
  {
    school: "San Diego State University (Georgia)",
    degree: "B.S. Computer Science",
    years: "2022",
    location: "Tbilisi, Georgia",
    notes: ["GPA 3.81", "Summa Cum Laude", "Dean's List"],
  },
];

const projects = [
  {
    title: "Project One",
    description: "A short description of what this project does and the problem it solves.",
    tags: ["React", "Node.js"],
    link: "#",
  },
  {
    title: "Project Two",
    description: "A short description of what this project does and the problem it solves.",
    tags: ["Python", "SQL"],
    link: "#",
  },
  {
    title: "Project Three",
    description: "A short description of what this project does and the problem it solves.",
    tags: ["Three.js", "WebGL"],
    link: "#",
  },
];
// ----------------------------------------------------------------------------

// North–south compass mark: two slim needles whose bases arc around a centre dot.
// Bases sit on a circle (r=5.4) concentric with the dot (r=2.8), leaving an even gap.
function CompassMark({ className, ref }) {
  return (
    <svg ref={ref} className={className} viewBox="3.2 0 9.6 36" aria-hidden="true" focusable="false">
      <path d="M8 1 L12.6 15.17 A5.4 5.4 0 0 0 3.4 15.17 Z" fill="currentColor" />
      <circle cx="8" cy="18" r="2.8" fill="currentColor" />
      <path d="M8 35 L12.6 20.83 A5.4 5.4 0 0 1 3.4 20.83 Z" fill="currentColor" />
    </svg>
  );
}

// Spins the compass needle with scroll momentum: faster scrolling = harder spin.
// The needle coasts to a stop wherever friction leaves it; after a beat, ROB and
// VAK slide back in and "push" it upright (same duration/easing, see CSS).
// Writes styles straight to the DOM each frame to avoid React re-renders.
function useScrollSpin(markRef, logoRef) {
  useEffect(() => {
    const mark = markRef.current;
    const logo = logoRef.current;
    if (!mark || !logo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const IMPULSE = 0.3; // deg/frame added per px scrolled
    const MAX_VEL = 45; // deg/frame cap
    const FRICTION = 0.955; // proportional drag per frame
    const DRAG = 0.04; // constant drag per frame, so it comes to a definite stop
    const SPREAD_AT = 12; // deg off upright before letters make room
    const REST_PAUSE = 300; // ms to sit still before realigning
    const REALIGN_MS = 550; // keep in sync with --realign in App.css

    let angle = 0;
    let vel = 0;
    let lastY = window.scrollY;
    let lastT = 0;
    let raf = 0;
    let restTimer = 0;
    let doneTimer = 0;
    let realigning = false;

    // Both ends are identical, so "upright" is any multiple of 180°
    const nearestRest = (a) => Math.round(a / 180) * 180;
    const tilt = (a) => Math.abs(a - nearestRest(a));

    const stopRealign = () => {
      clearTimeout(restTimer);
      clearTimeout(doneTimer);
      restTimer = 0;
      if (!realigning) return;
      // freeze wherever the realign transition currently is, then take over
      const current = parseFloat(getComputedStyle(mark).rotate) || 0;
      // computed value is normalised; keep the same visual pose
      angle = current;
      mark.classList.remove("is-realigning");
      mark.style.rotate = `${angle}deg`;
      realigning = false;
    };

    const realign = () => {
      restTimer = 0;
      realigning = true;
      mark.classList.add("is-realigning");
      logo.classList.remove("is-spinning"); // letters slide back in...
      mark.style.rotate = `${nearestRest(angle)}deg`; // ...and push the needle upright
      // safety net in case transitionend never fires (e.g. background tab)
      doneTimer = setTimeout(() => onRealignEnd({ propertyName: "rotate" }), REALIGN_MS + 100);
    };

    const onRealignEnd = (e) => {
      if (e.propertyName !== "rotate" || !realigning) return;
      clearTimeout(doneTimer);
      realigning = false;
      mark.classList.remove("is-realigning");
      angle = 0; // every upright pose looks identical
      mark.style.rotate = "";
    };

    const frame = (t) => {
      const dt = lastT ? Math.min((t - lastT) / 16.667, 3) : 1;
      lastT = t;

      vel *= Math.pow(FRICTION, dt);
      const drag = DRAG * dt;
      vel = Math.abs(vel) <= drag ? 0 : vel - Math.sign(vel) * drag;
      angle += vel * dt;
      mark.style.rotate = `${angle}deg`;

      if (tilt(angle) > SPREAD_AT) logo.classList.add("is-spinning");

      if (vel === 0) {
        raf = 0;
        lastT = 0;
        if (tilt(angle) > 0.01) restTimer = setTimeout(realign, REST_PAUSE);
        else {
          angle = 0;
          mark.style.rotate = "";
          logo.classList.remove("is-spinning");
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!dy) return;
      stopRealign();
      vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, vel + dy * IMPULSE));
      if (!raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mark.addEventListener("transitionend", onRealignEnd);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mark.removeEventListener("transitionend", onRealignEnd);
      cancelAnimationFrame(raf);
      clearTimeout(restTimer);
      clearTimeout(doneTimer);
    };
  }, [markRef, logoRef]);
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const markRef = useRef(null);
  const logoRef = useRef(null);
  useScrollSpin(markRef, logoRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // handle reloads mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a
          href="#top"
          ref={logoRef}
          className="nav__logo"
          aria-label={`${profile.brand} — ${profile.name}, back to top`}
        >
          <span className="nav__word nav__word--left">Rob</span>
          <CompassMark ref={markRef} className="nav__mark" />
          <span className="nav__word nav__word--right">Vak</span>
        </a>
        <nav>
          <ul className="nav__links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Brand marks for profile links (paths from GitHub Octicons / Simple Icons)
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      {/* Future: drop a lazy-loaded <Canvas> here as a background layer */}
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__photo">
        <img src={headshot} alt={`Portrait of ${profile.name}`} />
      </div>
      <div className="container hero__content">
        <p className="hero__eyebrow">{profile.role}</p>
        <h1 className="hero__title">
          Hi, I'm {profile.name}.
        </h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <div className="hero__actions">
          <div className="hero__social">
            <a
              href={profile.github}
              className="icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
            >
              <GitHubIcon />
            </a>
            <a
              href={profile.linkedin}
              className="icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon />
            </a>
          </div>
          <div className="hero__cta">
            <a href="#projects" className="btn btn--light">View my work</a>
            <a href="#contact" className="btn btn--outline">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceList() {
  const [open, setOpen] = useState(null);
  const baseId = useId();

  return (
    <ol className="timeline">
      {experience.map((job, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-job-${i}`;
        return (
          <li key={job.company} className={`timeline__item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="timeline__head"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="timeline__main">
                <span className="timeline__company">{job.company}</span>
                <span className="timeline__role">{job.role}</span>
              </span>
              <span className="timeline__years">{job.years}</span>
              <span className="timeline__icon" aria-hidden="true" />
            </button>
            <div className="timeline__panel" id={panelId} role="region" aria-label={`${job.company} details`}>
              <div className="timeline__panel-inner">
                <p className="timeline__dates">{job.dates}</p>
                <ul className="timeline__highlights">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function EducationList() {
  return (
    <ul className="edu">
      {education.map((e) => (
        <li key={e.school} className="edu__item">
          <div className="edu__top">
            <span className="timeline__company">{e.school}</span>
            <span className="timeline__years">{e.years}</span>
          </div>
          <p className="timeline__role">
            {e.degree} · {e.location}
          </p>
          <ul className="edu__notes">
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

const tabs = [
  { key: "experience", label: "Experience", Panel: ExperienceList },
  { key: "education", label: "Education", Panel: EducationList },
];

function Background() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const baseId = useId();

  function onKeyDown(e) {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="bg-panel">
      <div className="tabs" role="tablist" aria-label="Background">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.key}`}
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${t.key}`}
            tabIndex={active === i ? 0 : -1}
            className="tabs__tab"
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Panels share one grid cell, so the box is always as tall as the
          tallest panel and switching tabs never shifts the page below */}
      <div className="bg-panel__body">
        {tabs.map((t, i) => (
          <div
            key={t.key}
            role="tabpanel"
            id={`${baseId}-panel-${t.key}`}
            aria-labelledby={`${baseId}-tab-${t.key}`}
            className={`bg-panel__pane${active === i ? " is-active" : ""}`}
            inert={active !== i}
          >
            <t.Panel />
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="about__intro">
          <h2 className="section__title">About</h2>
          <div className="about__body">
            {about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <ul className="skills">
              {skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <Background />
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section section--alt" id="projects">
      <div className="container">
        <h2 className="section__title">Selected Projects</h2>
        <div className="projects">
          {projects.map((p) => (
            <article className="card" key={p.title}>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__desc">{p.description}</p>
              <ul className="card__tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a className="card__link" href={p.link}>
                View project <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container contact__inner">
        <h2 className="contact__title">Let's work together.</h2>
        <p className="contact__text">
          I'm open to new opportunities and collaborations. My inbox is always open.
        </p>
        <a className="btn btn--light" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ul className="contact__social">
          <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          {profile.linkedin && (
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          )}
        </ul>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} {profile.name}
        </div>
      </footer>
    </>
  );
}

export default App;
