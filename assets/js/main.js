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
      ? `<div class="media icon-only"><img src="${p.icon}" alt="${p.title} icon" loading="lazy"></div>`
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
