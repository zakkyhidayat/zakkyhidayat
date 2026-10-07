const list = document.getElementById("projects");
PROJECTS.forEach((p, i) => {
  const li = document.createElement("li");
  li.className = "project";
  const num = String(i + 1).padStart(2, "0");
  const links = [
    p.live && `<a href="${p.live}">Open live ↗</a>`,
    p.download && `<a href="${p.download}">Download ↗</a>`,
    p.repo && `<a href="${p.repo}">Source ↗</a>`,
  ].filter(Boolean).join("");
  const media = p.image
    ? `<div class="media"><img src="${p.image}" alt="Screenshot of ${p.title}" loading="lazy"></div>`
    : p.icon
      ? `<div class="media icon-only"${p.tint ? ` style="--tint:${p.tint}"` : ""}><img src="${p.icon}" alt="${p.title} icon" loading="lazy"></div>`
      : `<div class="media"><div class="placeholder">No image yet</div></div>`;
  const titleIcon = p.icon && p.image ? `<img class="app-icon" src="${p.icon}" alt="" width="26" height="26">` : "";
  li.innerHTML = `
    ${media}
    <div class="body">
      <div class="project-head"><span class="meta">${[p.platform, p.version].filter(Boolean).join(" · ")}</span><span class="idx">${num}</span></div>
      <h3>${titleIcon}${p.title}</h3>
      <p>${p.summary}</p>
      ${p.why ? `<p class="why">${p.why}</p>` : ""}
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <div class="project-links">${links}</div>
    </div>`;
  list.appendChild(li);
});

if (NOW.length) {
  document.getElementById("now-list").innerHTML = NOW.map(n => `<li>${n}</li>`).join("");
  document.getElementById("now").hidden = false;
}

// Local time in Bandung (WIB, UTC+7)
const clock = document.getElementById("clock");
const tick = () => {
  const t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date());
  clock.textContent = `Bandung · ${t} WIB`;
};
tick();
setInterval(tick, 30000);

document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
document.getElementById("theme-toggle").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// ---------- motion layer ----------
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Reveal on scroll (cards stagger)
const revealTargets = [
  ...document.querySelectorAll(".block .label, .cv-summary, .sub, .rows > li, .cv-grid > div, .note p"),
  ...document.querySelectorAll(".project"),
];
document.querySelectorAll(".project").forEach((el, i) => el.style.setProperty("--d", `${(i % 3) * 90}ms`));
revealTargets.forEach(el => el.classList.add("reveal"));
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
revealTargets.forEach(el => revealObs.observe(el));

// 2. Type the name once
const nameEl = document.getElementById("name");
if (!reduce && nameEl) {
  const full = nameEl.textContent;
  const h1 = nameEl.parentElement;
  h1.style.minHeight = `${h1.offsetHeight}px`;
  nameEl.textContent = "";
  h1.classList.add("typing");
  let i = 0;
  const step = () => {
    nameEl.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(step, 38);
    else { h1.classList.remove("typing"); h1.style.minHeight = ""; }
  };
  setTimeout(step, 250);
}

// 3. Current section in nav
const nav = document.querySelector(".top");
const where = document.getElementById("where");
const sections = [...document.querySelectorAll("section.block")].filter(s => !s.hidden);
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const label = e.target.querySelector(".label");
    const num = label.querySelector("span").textContent;
    const text = label.textContent.replace(num, "").trim();
    where.innerHTML = `<b>${num}</b>${text}`;
    where.classList.add("on");
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => sectionObs.observe(s));

let ticking = false;
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle("scrolled", y > 8);
  if (y < innerHeight * 0.5) where.classList.remove("on");
  ticking = false;
};
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener("resize", onScroll);
onScroll();

// 4. Reading focus on resume rows: only the row nearest the middle of the screen
const rowLists = [...document.querySelectorAll(".rows")];
const focusRows = () => {
  const mid = innerHeight / 2;
  rowLists.forEach(list => {
    const lr = list.getBoundingClientRect();
    const inBand = lr.top < mid && lr.bottom > mid;
    let best = null, bestD = Infinity;
    if (inBand) [...list.children].forEach(li => {
      const r = li.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; best = li; }
    });
    [...list.children].forEach(li => li.classList.toggle("active", li === best));
    list.classList.toggle("reading", !!best);
  });
};
addEventListener("scroll", () => requestAnimationFrame(focusRows), { passive: true });
focusRows();
