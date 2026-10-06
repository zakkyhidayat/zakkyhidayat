const list = document.getElementById("projects");
PROJECTS.forEach((p, i) => {
  const li = document.createElement("li");
  li.className = "project";
  const num = String(i + 1).padStart(2, "0");
  const links = [
    p.live && `<a href="${p.live}">LIVE ↗</a>`,
    p.download && `<a href="${p.download}">DOWNLOAD ↗</a>`,
    p.repo && `<a href="${p.repo}">CODE ↗</a>`,
  ].filter(Boolean).join("");
  const media = p.image
    ? `<img src="${p.image}" alt="Screenshot of ${p.title}" loading="lazy">`
    : `<div class="placeholder" aria-hidden="true"><span>${num}</span><small>NO IMAGE YET</small></div>`;
  li.innerHTML = `
    <div class="media">${media}</div>
    <div class="body">
      <div class="project-head"><span class="idx">${num}</span><div class="project-links">${links}</div></div>
      <h3>${p.icon ? `<img class="app-icon" src="${p.icon}" alt="" width="28" height="28">` : ""}${p.title}</h3>
      <p class="meta">${[p.platform, p.version].filter(Boolean).join(" · ")}</p>
      <p>${p.summary}</p>
      ${p.why ? `<p class="why">${p.why}</p>` : ""}
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
    </div>`;
  list.appendChild(li);
});

if (NOW.length) {
  document.getElementById("now-list").innerHTML = NOW.map(n => `<li>${n}</li>`).join("");
  document.getElementById("now").hidden = false;
}

document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
document.getElementById("theme-toggle").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});
