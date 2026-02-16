(function () {
  const carousel = document.querySelector(".hero-carousel");
  if (!carousel) return;

  let slides = [];
  let active = 0;
  let timer = null;

  function setActive(index) {
    active = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
  }

  function startRotation() {
    if (!slides.length) return;
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(() => {
      setActive((active + 1) % slides.length);
    }, 3000);
  }

  function renderSlides(imageSources) {
    if (!Array.isArray(imageSources) || !imageSources.length) return;
    carousel.innerHTML = "";
    imageSources.forEach((src, index) => {
      const img = document.createElement("img");
      img.className = `hero-slide${index === 0 ? " is-active" : ""}`;
      img.src = src;
      img.alt = "";
      carousel.appendChild(img);
    });
    slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    setActive(0);
    startRotation();
  }

  function verifyImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function fallbackSources() {
    const candidates = [];
    for (let i = 1; i <= 20; i += 1) {
      candidates.push(`images/hero-${i}.jpg`);
      candidates.push(`images/hero-${i}.jpeg`);
      candidates.push(`images/hero-${i}.png`);
      candidates.push(`images/hero-${i}.webp`);
      candidates.push(`images/hero-${i}.avif`);
    }

    const checked = await Promise.all(candidates.map(verifyImage));
    return checked.filter(Boolean);
  }

  async function loadSlides() {
    try {
      const local = await fallbackSources();
      renderSlides(local);
    } catch {
      const local = await fallbackSources();
      renderSlides(local);
    }
  }

  loadSlides();
})();
