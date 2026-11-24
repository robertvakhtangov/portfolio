import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import headshot from "./assets/headshot-cutout.webp";
import ScrollIndicator from "./ScrollIndicator.jsx";
import imgPatientAdvocate from "./assets/projects/patient-advocate.webp";
import imgBaseball from "./assets/projects/baseball.webp";
import imgWisp from "./assets/projects/wisp.webp";

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

// Collapsed, the first row shows in full and the second is cut off; the arrow reveals the rest.
// Optional per project: image (import it from ./assets, ideally ~1280×720, 16:9).
const projects = [
  {
    title: "Bluff-or-Buff",
    description:
      "HackPrinceton team project that checks causal claims against data: Gemini analyses an uploaded table, and statistics code caps the verdict so it never claims more than the data supports. I built the web app, accounts, background jobs, Investigator chat and Docker setup.",
    tags: ["Python", "React", "Gemini API", "Docker"],
    link: "https://github.com/SilverBC/CausalityAI",
  },
  {
    title: "Patient Advocate U.S.",
    description:
      "Website for a board-certified patient advocate who helps clients with insurance denials, medical billing and care coordination. Visitors fill in a consultation form, and a serverless function emails their answers to the advocate.",
    tags: ["React", "Tailwind CSS", "Vercel"],
    link: "https://hillary-tau.vercel.app",
    image: imgPatientAdvocate,
  },
  {
    title: "Stranger Football",
    description:
      "Clickable prototype of a pickup-football app for Tbilisi: find a game on a map of 834 real pitches from OpenStreetMap, take a spot on a team and play with strangers. I built the map interface, its filters and the game panels.",
    tags: ["TypeScript", "React", "Leaflet"],
  },
  {
    title: "Baseball Minigame",
    description:
      "Interactive Three.js baseball scene for a Computer Graphics final project. A pitcher keyframe-animated in Blender throws, you swing the bat, and physics written from scratch decides where the ball goes.",
    tags: ["Three.js", "JavaScript", "Blender"],
    link: "https://robertvakhtangov.github.io/baseball-minigame/",
    image: imgBaseball,
  },
  {
    title: "ProjLang Interpreter",
    description:
      "Interpreter for a small expression language with closures and recursive functions. A JavaCC grammar builds the syntax tree, and an object-oriented evaluator runs it with static scoping and runtime type checks. Final project for CSC 8310 at Villanova.",
    tags: ["Java", "JavaCC"],
  },
  {
    title: "Project Wisp",
    description:
      "Puzzle-platformer made in 48 hours for GMTK Game Jam 2020 on the theme \"out of control\": guide a flaming skull through a dimly lit dungeon while protecting the fire that keeps it alive. I was lead developer and designer.",
    tags: ["Game Jam", "2D Platformer", "Hand-drawn"],
    link: "https://darkroomlab.itch.io/wisp-gmtk2020",
    image: imgWisp,
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
// Programmatic scrolls (e.g. keeping the Projects arrow in place on collapse)
// shouldn't spin the logo compass; they mute it until this timestamp.
const spinMute = { until: 0 };

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
      if (!dy || performance.now() < spinMute.until) return;
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

// Collapsed, how much of the second row's screenshot stays visible (0.6 = the
// cut hides the bottom 40% of the image)
const PEEK_RATIO = 0.6;

// The tab under the cut: a semicircle (radius R) raised by F so its widest
// point sits right above the base, where it drops into the cut line through a
// quarter-circle fillet (radius F) on each side: a smooth right angle, no
// corners. Width is exactly twice the height. (The inset ring around the
// arrow, in App.css, is concentric with the dome: radius R - 14.) EXT extends the shape a little
// below the line so no sliver of the clipped cards shows through its edge.
const TAB = (() => {
  const R = 46;
  const F = 10;
  const EXT = 2;
  const H = R + F; // height above the cut line
  const W = 2 * (R + F);
  const outline =
    `M0 ${H} A${F} ${F} 0 0 0 ${F} ${R} ` + // left fillet up to the equator
    `A${R} ${R} 0 0 1 ${W - F} ${R} ` + // dome
    `A${F} ${F} 0 0 0 ${W} ${H}`; // right fillet down to the line
  return {
    viewBox: `0 0 ${W} ${H + EXT}`,
    H,
    W,
    shadowPath: `${outline} Z`, // casts the shadow; ends exactly at the line
    fillPath: `${outline} V${H + EXT} H0 Z`, // no shadow; overlaps below the line
  };
})();

function ProjectCard({ project, index, hidden }) {
  return (
    <article className="card" inert={hidden}>
      <div className="card__media">
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" />
        ) : (
          <span className="card__media-num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{project.title}</h3>
        <p className="card__desc">{project.description}</p>
        <ul className="card__tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {project.link && (
          <a
            className="card__link"
            href={project.link}
            {...(project.link.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
          >
            View project <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}

function Projects() {
  const [expanded, setExpanded] = useState(false);
  // cards in the first row; null until measured, 0 = everything fits in one row
  const [firstRow, setFirstRow] = useState(null);
  const clipRef = useRef(null);
  const gridRef = useRef(null);
  const doneTimer = useRef(0);
  const followRaf = useRef(0);
  const clipId = useId();

  // Measure where the second row starts so the cutoff lands partway through it,
  // whatever the column count. Re-runs on resize.
  useLayoutEffect(() => {
    const clip = clipRef.current;
    const grid = gridRef.current;
    if (!clip || !grid) return;
    const measure = () => {
      const cards = [...grid.children];
      const firstTop = cards[0]?.offsetTop ?? 0;
      const secondRowIndex = cards.findIndex((c) => c.offsetTop > firstTop + 1);
      if (secondRowIndex === -1) {
        setFirstRow(0);
        return;
      }
      const card = cards[secondRowIndex];
      const media = card.querySelector(".card__media");
      const cut = card.offsetTop + (media?.offsetHeight ?? card.offsetHeight) * PEEK_RATIO;
      clip.style.setProperty("--collapsed", `${Math.round(cut)}px`);

      setFirstRow(secondRowIndex);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(doneTimer.current);
      cancelAnimationFrame(followRaf.current);
    },
    []
  );

  // While collapsing, the content above the arrow shrinks and would drag it up
  // and off screen. Scroll by however far it moves each frame so it stays put.
  function keepInView(target, duration) {
    cancelAnimationFrame(followRaf.current);
    spinMute.until = performance.now() + duration + 100;
    const anchor = target.getBoundingClientRect().top;
    const end = performance.now() + duration;
    const step = () => {
      const drift = target.getBoundingClientRect().top - anchor;
      if (Math.abs(drift) >= 0.5) window.scrollBy({ top: drift, behavior: "instant" });
      if (performance.now() < end) followRaf.current = requestAnimationFrame(step);
    };
    followRaf.current = requestAnimationFrame(step);
  }

  const hasMore = firstRow > 0;

  function toggle(e) {
    const el = clipRef.current;
    if (!el) return;
    clearTimeout(doneTimer.current);
    cancelAnimationFrame(followRaf.current);
    if (!expanded) {
      el.style.transitionDuration = "0.9s";
      el.style.maxHeight = `${el.scrollHeight}px`;
      // unlock afterwards so the grid can reflow freely
      doneTimer.current = setTimeout(() => (el.style.maxHeight = "none"), 950);
    } else if (snapCollapse()) {
      collapseInPlace(e.currentTarget);
    } else {
      el.style.transitionDuration = "0.5s";
      el.style.maxHeight = `${el.scrollHeight}px`;
      void el.offsetHeight; // commit the start height before collapsing
      el.style.maxHeight = "";
      keepInView(e.currentTarget, 650);
    }
    setExpanded(!expanded);
  }

  // Touch devices (iOS Safari scrolls on a separate thread, so a per-frame
  // scroll correction lands a frame late and jitters) and reduced motion:
  // fade the cards out, collapse and re-scroll in one step so the arrow stays
  // put, then fade back in. Nothing animates while the page is scrolling.
  function snapCollapse() {
    return window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches;
  }

  function collapseInPlace(target) {
    const el = clipRef.current;
    el.style.transition = "opacity 0.15s ease";
    el.style.opacity = "0";
    doneTimer.current = setTimeout(() => {
      const before = target.getBoundingClientRect().top;
      el.style.maxHeight = ""; // collapses instantly: only opacity transitions now
      const delta = target.getBoundingClientRect().top - before;
      spinMute.until = performance.now() + 300;
      window.scrollBy({ top: delta, behavior: "instant" });
      el.style.transition = "opacity 0.2s ease";
      el.style.opacity = "1";
      doneTimer.current = setTimeout(() => {
        el.style.transition = "";
        el.style.opacity = "";
      }, 220);
    }, 160);
  }

  return (
    <section className="section section--alt" id="projects">
      <div className="container">
        <h2 className="section__title">Selected Projects</h2>
        <div
          ref={clipRef}
          id={clipId}
          className={`projects-clip${hasMore ? " has-more" : ""}${expanded ? " is-open" : ""}`}
        >
          <div className="projects" ref={gridRef}>
            {projects.map((p, i) => (
              <ProjectCard
                key={p.title}
                project={p}
                index={i}
                hidden={hasMore && !expanded && i >= firstRow}
              />
            ))}
          </div>
        </div>

        {hasMore && (
          <div className={`projects__toggle${expanded ? " is-open" : ""}`}>
            <span className="projects__cut-shadow" aria-hidden="true" />
            <button
              type="button"
              className={`more-tab${expanded ? " is-open" : ""}`}
              aria-expanded={expanded}
              aria-controls={clipId}
              onClick={toggle}
            >
              <svg
                className="more-tab__shape"
                viewBox={TAB.viewBox}
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  {/* everything above the cut line, with room for the blur */}
                  <clipPath id="more-tab-above-line">
                    <rect x={-30} y={-30} width={TAB.W + 60} height={TAB.H + 30} />
                  </clipPath>
                </defs>
                <g clipPath="url(#more-tab-above-line)">
                  <path className="more-tab__shadow" d={TAB.shadowPath} />
                </g>
                <path d={TAB.fillPath} />
              </svg>
              <span className="more-tab__ring" aria-hidden="true" />
              <svg className="more-tab__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {/* Arrowhead: same 12×6 footprint as a chevron, filled, with a
                    narrow concave notch in the middle of its back edge */}
                <path
                  d="M6 9.5 L12 15.5 L18 9.5 C 15 9.6, 13.4 11.7, 12 11.7 C 10.6 11.7, 9 9.6, 6 9.5 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">
                {expanded ? "Show fewer projects" : `Show all ${projects.length} projects`}
              </span>
            </button>
          </div>
        )}
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
      <ScrollIndicator />
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
