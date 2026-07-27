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

function render(data) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const p = data.profile;

  const prompt = el("div", "prompt");
  prompt.innerHTML = '~ $ whoami<span class="cursor">▊</span>'; // static markup only
  app.appendChild(prompt);

  app.appendChild(text("h1", null, p.name));
  app.appendChild(text("div", "role", p.role));
  app.appendChild(text("div", "loc", p.location));
  app.appendChild(text("div", "tag", "// " + p.tagline));

  // Links
  const links = el("div", "links");
  data.links.forEach((l) => {
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

  // Experience
  app.appendChild(section("experience"));
  data.experience.forEach((e) => {
    const row = el("div", "exp");
    const co = text("span", "co", e.company + " ");
    co.appendChild(text("span", "r", "— " + e.role));
    row.appendChild(co);
    row.appendChild(text("span", "yr", e.years));
    app.appendChild(row);
  });
  const cv = el("div", "cv-link");
  cv.appendChild(link("→ full history in the CV", data.cvUrl));
  app.appendChild(cv);

  // Footer
  const year = new Date().getFullYear();
  const foot = el("div", "foot");
  foot.appendChild(document.createTextNode("© " + year + " André Nogueira · built with plain HTML/CSS · "));
  foot.appendChild(link("source", data.sourceUrl));
  app.appendChild(foot);
}

// Theme
function initTheme() {
  const saved = localStorage.getItem("theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (sysDark ? "dark" : "light"));
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
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
