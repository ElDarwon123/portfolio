(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-reveal-delay');
        if (delay) {
          setTimeout(function() { entry.target.classList.add('in-view'); }, parseInt(delay));
        } else {
          entry.target.classList.add('in-view');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      observer.observe(el);
    });
  });
})();
