// Renders the page from data.json (single source of truth) and handles theming.

// el(tag, cls) creates an element; callers set text via textContent so all
// data-driven content is injection-safe and robust to special characters.
const el = (tag, cls) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};

const text = (tag, cls, str) => {
  const n = el(tag, cls);
  n.textContent = str;
  return n;
};

function section(title) {
  // Semantic <h2> so the page exposes a real heading outline to screen readers.
  return text("h2", "sec", "# " + title);
}

function link(label, href, opts) {
  opts = opts || {};
  const a = el("a", opts.cls);
  a.textContent = label;
  a.href = href;
  if (!opts.sameTab) { a.target = "_blank"; a.rel = "noopener"; }
  return a;
}

// A CV download link whose target follows the active theme (light/dark PDF).
// applyTheme() sets the actual href from the data-cv-* attributes.
function cvLink(label, data, cls) {
  const a = el("a", cls ? "cvlink " + cls : "cvlink");
  a.textContent = label;
  a.dataset.cvLight = data.cvUrl;
  a.dataset.cvDark = data.cvUrlDark;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

function render(data) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const p = data.profile;

  // Prompt line doubles as the theme switch: `~ $ whoami --theme=light | dark`
  const prompt = el("div", "prompt");
  prompt.appendChild(document.createTextNode("~ $ whoami --theme="));
  const opt = (name) => {
    const b = el("button", "opt");
    b.type = "button";
    b.dataset.set = name;
    b.textContent = name;
    b.addEventListener("click", () => applyTheme(name, true));
    return b;
  };
  const sw = el("span", "switch");
  sw.appendChild(opt("light"));
  sw.appendChild(text("span", "sep", " | "));
  sw.appendChild(opt("dark"));
  prompt.appendChild(sw);
  prompt.appendChild(text("span", "cursor", "▊"));
  app.appendChild(prompt);

  app.appendChild(text("h1", null, p.name));
  app.appendChild(text("div", "role", p.role));
  app.appendChild(text("div", "loc", p.location));
  app.appendChild(text("div", "tag", "// " + p.tagline));

  // Links
  const links = el("div", "links");
  data.links.forEach((l) => {
    if (l.cv) { links.appendChild(cvLink(l.label, data)); return; }
    links.appendChild(link(l.label, l.href, { cls: l.muted ? "muted" : null }));
  });
  app.appendChild(links);

  // About
  app.appendChild(section("about"));
  app.appendChild(text("div", "tag", p.about));

  // Selected work
  app.appendChild(section("selected work"));
  data.projects.forEach((pr) => {
    const wrap = el("div", "project");
    const name = pr.href ? link(pr.name, pr.href, { cls: "name" }) : text("span", "name", pr.name);
    wrap.appendChild(name);
    wrap.appendChild(text("span", "stack", " · " + pr.stack));
    wrap.appendChild(text("div", "desc", pr.desc));
    app.appendChild(wrap);
  });

  // Writing & video
  app.appendChild(section("writing & video"));
  const w = data.writing;
  const wline = el("div", "tag");
  wline.appendChild(link(w.blog.label, w.blog.href));
  wline.appendChild(document.createTextNode(" — " + w.blurb));
  app.appendChild(wline);

  // Footer
  const year = new Date().getFullYear();
  const foot = el("div", "foot");
  foot.appendChild(document.createTextNode("© " + year + " André Nogueira · built with plain HTML/CSS · "));
  foot.appendChild(link("source", data.sourceUrl));
  app.appendChild(foot);

  // Now that the switch and CV links exist, sync them to the active theme.
  applyTheme(currentTheme(), false);
}

// Theme
function currentTheme() {
  return document.documentElement.getAttribute("data-theme");
}

// Apply a theme, optionally persisting the user's explicit choice, and reflect
// the active state on the in-prompt switch (no-op before the prompt is rendered).
function applyTheme(theme, persist) {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) localStorage.setItem("theme", theme);
  document.querySelectorAll(".prompt .opt").forEach((b) => {
    const active = b.dataset.set === theme;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });
  // CV links point at the PDF variant matching the active theme.
  document.querySelectorAll("a.cvlink").forEach((a) => {
    a.href = theme === "dark" ? a.dataset.cvDark : a.dataset.cvLight;
  });
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (sysDark ? "dark" : "light"), false);
}

initTheme();
fetch("data.json")
  .then((r) => {
    if (!r.ok) throw new Error("data.json HTTP " + r.status);
    return r.json();
  })
  .then(render)
  .catch((e) => {
    document.getElementById("app").innerHTML =
      '<p>Failed to load content. <a href="https://github.com/aanogueira">GitHub</a></p>';
    console.error(e);
  });
