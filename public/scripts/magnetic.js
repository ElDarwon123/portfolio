(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = 'translate(0, 0)';
      });
    });
  });
})();
