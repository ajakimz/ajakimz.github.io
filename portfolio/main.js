(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [
    '.home-scrap > div', '.home-scrap figure', '.home-work .section-heading',
    '.home-work .project', '.home-work .text-link', '.projects-page > .eyebrow',
    '.projects-page > h1', '.projects-page .project', '.about-page > *', '.case-study > *'
  ];
  const elements = document.querySelectorAll(targets.join(','));
  document.documentElement.classList.add('js');
  elements.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.matches('figure, img')) element.classList.add('reveal--image');
    element.classList.add(`reveal--delay-${index % 4}`);
  });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
  elements.forEach((element) => observer.observe(element));
})();
