document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const image = document.querySelector('.product__image');
if (image) {
  const showImageFallback = () => image.classList.add('is-unavailable');
  image.addEventListener('error', showImageFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) showImageFallback();
}

document.querySelectorAll('video').forEach((video) => {
  const showVideoFallback = () => video.classList.add('is-unavailable');
  video.addEventListener('error', showVideoFallback, { once: true });
  const source = video.querySelector('source');
  source?.addEventListener('error', showVideoFallback, { once: true });
});

document.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
});

const parallaxItems = document.querySelectorAll('[data-parallax]');
let ticking = false;

function updateParallax() {
  const viewportCenter = window.innerHeight / 2;
  parallaxItems.forEach((item) => {
    const rect = item.parentElement.getBoundingClientRect();
    const speed = Number(item.dataset.parallax) || 0;
    const distance = (rect.top + rect.height / 2 - viewportCenter) * speed;
    item.style.transform = `translate3d(0, ${distance.toFixed(2)}px, 0)`;
  });
  ticking = false;
}

function requestParallaxUpdate() {
  if (prefersReducedMotion.matches || ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateParallax);
}

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate, { passive: true });
requestParallaxUpdate();
