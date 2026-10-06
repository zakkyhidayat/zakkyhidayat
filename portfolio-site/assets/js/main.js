const list = document.getElementById("projects");
PROJECTS.forEach((p, i) => {
  const li = document.createElement("li");
  li.className = "project";
  const num = String(i + 1).padStart(2, "0");
  const links = [
    p.demo && `<a href="${p.demo}">DEMO ↗</a>`,
    p.repo && `<a href="${p.repo}">KODE ↗</a>`,
  ].filter(Boolean).join("");
  const media = p.image
    ? `<img src="${p.image}" alt="Tampilan ${p.title}" loading="lazy">`
    : `<div class="placeholder" aria-hidden="true"><span>${num}</span><small>GAMBAR BELUM ADA</small></div>`;
  li.innerHTML = `
    <div class="media">${media}</div>
    <div class="body">
      <div class="project-head"><span class="idx">${num}</span><div class="project-links">${links}</div></div>
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
    </div>`;
  list.appendChild(li);
});

document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
document.getElementById("theme-toggle").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});
