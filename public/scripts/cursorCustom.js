(function() {
  var dot, ring, mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  var LERP = 0.15;
  var isHovering = false;

  function init() {
    dot = document.getElementById('cursor-dot');
    ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    var hoverEls = document.querySelectorAll('a, button, .magnetic, input, textarea');
    hoverEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        isHovering = true;
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function() {
        isHovering = false;
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });

    animate();
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    dotX = lerp(dotX, mouseX, LERP);
    dotY = lerp(dotY, mouseY, LERP);
    ringX = lerp(ringX, mouseX, 0.08);
    ringY = lerp(ringY, mouseY, 0.08);

    dot.style.transform = 'translate(' + (dotX - 5) + 'px, ' + (dotY - 5) + 'px)';
    ring.style.transform = 'translate(' + (ringX - 16) + 'px, ' + (ringY - 16) + 'px)';

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
