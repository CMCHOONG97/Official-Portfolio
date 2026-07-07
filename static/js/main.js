function changeImage(imageId, direction) {
  let index = window[`${imageId}_index`] || 0;
  const images = window[`${imageId}_images`] || [];
  if (images.length === 0) return;

  index = (index + direction + images.length) % images.length;

  const imagePath = images[index].startsWith("static/")
    ? images[index]
    : "static/" + images[index];

  const imgElement = document.getElementById(imageId);
  if (imgElement) {
    imgElement.src = imagePath;
    window[`${imageId}_index`] = index;
  }
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.textContent = theme === "light" ? "🌙" : "☀️";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  updateThemeIcon(next);

  const logo = document.getElementById("siteLogo");
  if (logo) {
    logo.src = next === "dark"
      ? "static/images/CM97_Geometric_Logo (Night View).png"
      : "static/images/CM97_Geometric_Logo (Edit).png";
  }
}

function formatDescription(text) {
  if (!text) return "<p>No description available.</p>";

  const lines = text.split("\n").map(l => l.trim());
  let html = "";
  let listBuffer = [];
  let paraBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      html += "<ul>" + listBuffer.map(item => `<li>${item}</li>`).join("") + "</ul>";
      listBuffer = [];
    }
  }
  function flushPara() {
    if (paraBuffer.length) {
      html += `<p>${paraBuffer.join("<br>")}</p>`;
      paraBuffer = [];
    }
  }

  lines.forEach(line => {
    if (!line) { flushList(); flushPara(); return; }
    if (line.startsWith("### ")) { flushList(); flushPara(); html += `<h3>${line.slice(4)}</h3>`; }
    else if (line.startsWith("## ")) { flushList(); flushPara(); html += `<h2>${line.slice(3)}</h2>`; }
    else if (line.startsWith("# ")) { flushList(); flushPara(); html += `<h1>${line.slice(2)}</h1>`; }
    else if (line.startsWith("- ")) { flushPara(); listBuffer.push(line.slice(2)); }
    else { flushList(); paraBuffer.push(line); }
  });
  flushList();
  flushPara();

  return html;
}

function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("show");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
  document.getElementById("modalContent").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.querySelector(".nav-toggle").addEventListener("click", toggleMenu);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  loadProjects();
  loadCertificates();
});

async function loadCertificates() {
  const container = document.getElementById("certificate-list");
  if (!container) return;

  try {
    const res = await fetch("static/data/certificates.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const certificates = await res.json();

    container.innerHTML = certificates.map((c, index) => `
      <div class="project-card">
        <h3>${c.title}</h3>
        <p>${c.issuer || ""}</p>
        <div class="btn-group">
          ${c.details ? `<a href="javascript:void(0)" class="btn cert-details-btn" data-index="${index}">Course Details</a>` : ""}
          ${c.pdf ? `<a href="${c.pdf}" class="btn" target="_blank">View Certificate</a>` : ""}
          ${(c.links || []).map(l => `<a href="${l.url}" class="btn" target="_blank">${l.label}</a>`).join("")}
        </div>
      </div>
    `).join("");

    // 每个 "Course Details" 按钮，点击时从对应证书的 details 内容开 modal
    container.querySelectorAll(".cert-details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cert = certificates[btn.dataset.index];
        openModal(formatDescription(cert.details));
      });
    });
  } catch (err) {
    container.innerHTML = "⚠️ Failed to load certificates.";
    console.error("Error loading certificates:", err.message);
  }
}

async function loadProjects() {
  const container = document.getElementById("project-list");

  try {
    // 读取本地 JSON（由 netlify.toml 在每次部署时自动跑
    // scripts/generateProjects.js 重新生成，不需要数据库）
    const res = await fetch("static/data/projects.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    container.innerHTML = "";

    projects.forEach((p, index) => {
        const imageId = `project-image-${index}`;
        const projectImages = (p.images || []).map(img =>
          img.startsWith("static/") ? img : "static/" + img
        );

        container.innerHTML += `
          <div class="project-card">
            <div class="image-slider">
              <button class="prev" onclick="changeImage('${imageId}', -1)">&#10094;</button>
              <img id="${imageId}" src="${projectImages[0] || 'static/images/placeholder.jpg'}" alt="${p.title}">
              <button class="next" onclick="changeImage('${imageId}', 1)">&#10095;</button>
            </div>
            <h3>${p.title || "Untitled Project"}</h3>
            <p>${p.description || "No description available."}</p>
            <p><strong>Tech:</strong> ${p.tech || "N/A"}</p>
            ${p.github ? `<a href="${p.github}" target="_blank" class="btn">GitHub</a>` : ""}
            ${p.link ? `<a href="${p.link}" target="_blank" class="btn">Link</a>` : ""}
          </div>
        `;

        window[`${imageId}_index`] = 0;
        window[`${imageId}_images`] = projectImages;
      });
  } catch (err) {
    container.innerHTML = "⚠️ Failed to load projects.";
    console.error("Error loading projects:", err.message);
  }
}
