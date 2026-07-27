// Renders the page from data.json (single source of truth) and handles theming.

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

function section(title) {
  return el("div", "sec", "# " + title);
}

function render(data) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const p = data.profile;

  app.appendChild(el("div", "prompt", '~ $ whoami<span class="cursor">▊</span>'));
  app.appendChild(el("h1", null, p.name));
  app.appendChild(el("div", "role", p.role));
  app.appendChild(el("div", "loc", p.location));
  app.appendChild(el("div", "tag", "// " + p.tagline));

  // Links
  const links = el("div", "links");
  data.links.forEach((l) => {
    const a = el("a", l.muted ? "muted" : null, l.label);
    a.href = l.href;
    if (!l.muted) { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a);
  });
  app.appendChild(links);

  // About
  app.appendChild(section("about"));
  app.appendChild(el("div", "tag", p.about));

  // Selected work
  app.appendChild(section("selected work"));
  data.projects.forEach((pr) => {
    const wrap = el("div", "project");
    const name = pr.href ? el("a", "name") : el("span", "name");
    name.textContent = pr.name;
    if (pr.href) { name.href = pr.href; name.target = "_blank"; name.rel = "noopener"; }
    wrap.appendChild(name);
    wrap.appendChild(el("span", "stack", " · " + pr.stack));
    wrap.appendChild(el("div", "desc", pr.desc));
    app.appendChild(wrap);
  });

  // Writing & video
  app.appendChild(section("writing & video"));
  const w = data.writing;
  const wline = el("div", "tag");
  const blog = el("a"); blog.href = w.blog.href; blog.textContent = w.blog.label;
  blog.target = "_blank"; blog.rel = "noopener"; blog.style.color = "var(--accent)";
  wline.appendChild(blog);
  wline.appendChild(document.createTextNode(" — " + w.blurb));
  app.appendChild(wline);

  // Experience
  app.appendChild(section("experience"));
  data.experience.forEach((e) => {
    const row = el("div", "exp");
    row.appendChild(el("span", "co", e.company + ' <span class="r">— ' + e.role + "</span>"));
    row.appendChild(el("span", "yr", e.years));
    app.appendChild(row);
  });
  const cv = el("div", "cv-link");
  const cva = el("a"); cva.href = data.cvUrl; cva.textContent = "→ full history in the CV";
  cva.target = "_blank"; cva.rel = "noopener"; cva.style.color = "var(--accent)";
  cv.appendChild(cva);
  app.appendChild(cv);

  // Footer
  const year = new Date().getFullYear();
  const foot = el("div", "foot");
  foot.innerHTML = "© " + year + " André Nogueira · built with plain HTML/CSS · ";
  const src = el("a"); src.href = data.sourceUrl; src.textContent = "source";
  src.target = "_blank"; src.rel = "noopener";
  foot.appendChild(src);
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
  .then((r) => r.json())
  .then(render)
  .catch((e) => {
    document.getElementById("app").innerHTML =
      '<p>Failed to load content. <a href="https://github.com/aanogueira">GitHub</a></p>';
    console.error(e);
  });
