import "./App.css";
import headshot from "./assets/headshot-cutout.webp";

// ---- Edit your content here ------------------------------------------------
const profile = {
  name: "Robert Vakhtangov",
  role: "Software Developer",
  tagline:
    "I build thoughtful, fast web experiences — from clean interfaces to the systems behind them.",
  email: "hello@example.com",
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-username",
};

const about = [
  "I'm a developer who enjoys turning ideas into polished, usable products. I care about the details: performance, accessibility, and interfaces that feel good to use.",
  "Lately I've been exploring creative coding and 3D on the web with Three.js.",
];

const skills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Three.js", "SQL", "Git"];

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
        <a href="#top" className="nav__logo">
          {profile.name}
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

function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
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
