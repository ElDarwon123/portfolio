(function() {
  var blobs = [];
  document.addEventListener('DOMContentLoaded', function() {
    blobs = document.querySelectorAll('[data-parallax]');
    if (blobs.length === 0) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.pageYOffset;
          blobs.forEach(function(blob) {
            var speed = parseFloat(blob.getAttribute('data-parallax')) || 0.3;
            var rect = blob.getBoundingClientRect();
            var offset = (rect.top + scrollY) * speed - scrollY * speed;
            blob.style.transform = 'translateY(' + offset + 'px)';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  });
})();
