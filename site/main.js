// Renders the page from data.json (single source of truth).
// The static HTML already carries the profile, so this refreshes it, builds
// the grouped link list and runs the local clock. Text goes in via
// textContent so data-driven content is injection-safe.

const SVG_NS = "http://www.w3.org/2000/svg";

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

// One icon family: 24px grid, 1.5 stroke, square caps, no fills.
function arrow(down) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "od-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", down ? "M12 5v14M6 13l6 6 6-6" : "M7 17 17 7M9 7h8v8");
  svg.appendChild(path);
  return svg;
}

function anchor(href, cls) {
  const a = el("a", cls);
  a.href = href;
  if (!href.startsWith("mailto:")) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  return a;
}

const announce = (msg) => {
  const s = document.getElementById("status");
  if (s) s.textContent = msg;
};

function copyButton(value, label) {
  const b = text("button", "aside", "copy");
  b.type = "button";
  b.setAttribute("aria-label", "Copy " + label.toLowerCase() + " address");
  let timer;
  b.addEventListener("click", () => {
    navigator.clipboard.writeText(value).then(
      () => {
        b.textContent = "copied";
        b.classList.add("is-done");
        announce(label + " address copied");
        clearTimeout(timer);
        timer = setTimeout(() => {
          b.textContent = "copy";
          b.classList.remove("is-done");
        }, 1600);
      },
      () => announce("Copy failed, use the link instead")
    );
  });
  return b;
}

// Handles never break mid-word: an email splits only before the "@".
function handle(str) {
  const h = el("span", "link-handle");
  const at = str.indexOf("@");
  if (at > 0) {
    h.appendChild(text("span", "nowrap", str.slice(0, at)));
    h.appendChild(text("span", "nowrap", str.slice(at)));
  } else {
    h.appendChild(text("span", "nowrap", str));
  }
  return h;
}

function linkItem(l, data, index) {
  const li = el("li", "item");
  li.style.setProperty("--i", index);

  const href = l.cv ? data.cvUrl : l.href;
  const a = anchor(href, "link");
  a.appendChild(text("span", "link-label", l.label));
  a.appendChild(handle(l.handle || ""));
  const ic = el("span", "link-arrow");
  ic.appendChild(arrow(!!l.cv));
  a.appendChild(ic);
  li.appendChild(a);

  // The page shows both palettes, so offer the dark CV as a secondary link.
  if (l.cv && data.cvUrlDark) {
    const dark = anchor(data.cvUrlDark, "aside");
    dark.textContent = "dark";
    dark.setAttribute("aria-label", "CV, dark version (PDF)");
    li.appendChild(dark);
  }
  if (l.copy && navigator.clipboard && window.isSecureContext) {
    li.appendChild(copyButton(l.copy, l.label));
  }
  return li;
}

function render(data) {
  const p = data.profile;

  // Name: split before the last word so it sets as a two-line lockup.
  const name = document.getElementById("name");
  const cut = p.name.lastIndexOf(" ");
  const lines = name.querySelectorAll(".name-line");
  if (cut > 0 && lines.length === 2) {
    lines[0].textContent = p.name.slice(0, cut);
    lines[1].firstChild.nodeValue = p.name.slice(cut + 1);
  }
  document.getElementById("role").textContent = p.role;
  document.getElementById("loc").textContent = p.location;
  document.getElementById("tag").textContent = p.tagline;
  if (data.site) document.getElementById("site").textContent = data.site;
  if (p.city) document.getElementById("city").textContent = p.city;

  // Groups in order of first appearance in data.json.
  const order = [];
  const byGroup = {};
  data.links.forEach((l) => {
    const g = l.group || "Links";
    if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
    byGroup[g].push(l);
  });

  const root = document.getElementById("groups");
  root.textContent = "";
  let index = 0;
  order.forEach((g, gi) => {
    const sec = el("section", "group");
    const id = "group-" + gi;
    sec.setAttribute("aria-labelledby", id);
    const h = text("h2", "group-title", g);
    h.id = id;
    sec.appendChild(h);
    const ul = el("ul", "links");
    byGroup[g].forEach((l) => ul.appendChild(linkItem(l, data, index++)));
    sec.appendChild(ul);
    root.appendChild(sec);
  });

  const foot = document.getElementById("foot");
  foot.textContent = "";
  foot.appendChild(document.createTextNode("© " + new Date().getFullYear() + " · "));
  const src = anchor(data.sourceUrl, "foot-link");
  src.textContent = "source";
  foot.appendChild(src);

  startClock(p.timeZone || "Europe/Lisbon", p.city || "Lisbon");
}

// Local time, refreshed on the minute boundary.
function startClock(timeZone, city) {
  const clock = document.getElementById("clock");
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
  } catch (e) {
    clock.parentElement.hidden = true;
    return;
  }
  clock.setAttribute("aria-label", "Local time in " + city);
  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now);
    clock.dateTime = now.toISOString();
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
  };
  tick();
}

fetch("data.json")
  .then((r) => {
    if (!r.ok) throw new Error("data.json HTTP " + r.status);
    return r.json();
  })
  .then(render)
  .catch((e) => {
    const root = document.getElementById("groups");
    root.textContent = "";
    const msg = el("p", "noscript");
    msg.appendChild(document.createTextNode("Failed to load links. Find me on "));
    const a = anchor("https://github.com/aanogueira");
    a.textContent = "GitHub";
    msg.appendChild(a);
    msg.appendChild(document.createTextNode("."));
    root.appendChild(msg);
    startClock("Europe/Lisbon", "Lisbon");
    console.error(e);
  });
