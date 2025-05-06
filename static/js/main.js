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

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);

  const logo = document.getElementById("siteLogo");
  if (logo) {
    logo.src = next === "dark"
      ? "static/images/CM97_Geometric_Logo (Night View).png"
      : "static/images/CM97_Geometric_Logo (Edit).png";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.querySelector(".nav-toggle").addEventListener("click", toggleMenu);

  fetch("static/data/projects.json")
    .then(res => res.json())
    .then(projects => {
      const container = document.getElementById("project-list");
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
    })
    .catch(err => {
      document.getElementById("project-list").innerHTML = "⚠️ Failed to load projects.";
      console.error("Error loading projects:", err.message);
    });
});
