(function() {
  var bar;
  document.addEventListener('DOMContentLoaded', function() {
    bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
      bar.style.opacity = scrollTop > 80 ? '1' : '0';
    });
  });
})();
