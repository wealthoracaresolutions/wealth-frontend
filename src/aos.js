export const animatedClasses = [
  "fadeinUp",
  "fadeinDown",
  "fadeinLeft",
  "fadeinRight",
];

const observer =
  typeof IntersectionObserver === "undefined"
    ? null
    : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("aos-pending");
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      });

const observeClass = (className) => {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    if (isInViewport || !observer) {
      element.classList.add("visible");
      return;
    }

    element.classList.add("aos-pending");
    observer.observe(element);
  });
};

export default observeClass;
