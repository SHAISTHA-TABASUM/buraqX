const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".hero-grid, .hero-glow, .hero-bg, .flight-grid");
const body = document.body;
const isHomePage = body.classList.contains("page-home");
const isServicesPage = body.classList.contains("page-services");
const isLearningPage = body.classList.contains("page-learning");
const isContactPage = body.classList.contains("page-contact");

revealItems.forEach((item, index) => {
  if (isServicesPage && item.classList.contains("service-card") && index % 2 === 1) {
    item.classList.add("service-slide-right");
  }

  if (!item.classList.contains("reveal-delay") && !item.classList.contains("reveal-delay-2")) {
    let stagger = Math.min(index % 4, 3) * 70;

    if (isHomePage) {
      stagger = Math.min(index % 4, 3) * 90;
    } else if (isServicesPage) {
      stagger = Math.min(index % 5, 4) * 110;
    } else if (isLearningPage) {
      stagger = Math.min(index % 4, 3) * 85;
    } else if (isContactPage) {
      stagger = Math.min(index % 3, 2) * 60;
    }

    item.style.transitionDelay = `${stagger}ms`;
  } else if (isServicesPage && item.classList.contains("service-card")) {
    const offset = item.classList.contains("reveal-delay-2") ? 220 : 120;
    item.style.transitionDelay = `${offset}ms`;
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: isContactPage ? 0.2 : 0.14,
    rootMargin: isContactPage ? "0px 0px -72px 0px" : "0px 0px -56px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

parallaxItems.forEach((item) => item.classList.add("parallax-layer"));
parallaxItems.forEach((item) => {
  item.dataset.baseTransform = getComputedStyle(item).transform === "none"
    ? ""
    : getComputedStyle(item).transform;
});

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && window.innerWidth > 900) {
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  const animateParallax = () => {
    currentX += (pointerX - currentX) * 0.06;
    currentY += (pointerY - currentY) * 0.06;

    parallaxItems.forEach((item, index) => {
      const depth = (index + 1) * 6;
      const x = currentX * depth;
      const y = currentY * depth;
      const baseTransform = item.dataset.baseTransform && item.dataset.baseTransform !== "none"
        ? item.dataset.baseTransform
        : "";
      item.style.transform = `${baseTransform} translate3d(${x}px, ${y}px, 0)`.trim();
    });

    window.requestAnimationFrame(animateParallax);
  };

  window.requestAnimationFrame(animateParallax);
}
