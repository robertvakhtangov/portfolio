import { useId, useRef, useState } from "react";
import "./App.css";
import headshot from "./assets/headshot-cutout.webp";

// ---- Edit your content here ------------------------------------------------
const profile = {
  name: "Robert Vakhtangov",
  brand: "RobVak",
  role: "Software Engineer",
  tagline:
    "I build thoughtful, fast web experiences — from clean interfaces to the systems behind them.",
  email: "hello@example.com",
  github: "https://github.com/robertvakhtangov",
  linkedin: "https://linkedin.com/in/your-username",
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

function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" aria-label={`${profile.brand} — ${profile.name}, back to top`}>
          {profile.brand}
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
          <a href="#projects" className="btn btn--light">View my work</a>
          <a href="#contact" className="btn btn--outline">Get in touch</a>
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
      {tabs.map((t, i) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${baseId}-panel-${t.key}`}
          aria-labelledby={`${baseId}-tab-${t.key}`}
          hidden={active !== i}
        >
          <t.Panel />
        </div>
      ))}
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
          <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
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
