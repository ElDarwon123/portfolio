(function() {
  var canvas, ctx, trails = [];
  var TRAIL_LENGTH = 20;
  var TRAIL_FADE = 0.92;

  function init() {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function(e) {
      trails.push({ x: e.clientX, y: e.clientY, alpha: 1, size: 3 });
      if (trails.length > TRAIL_LENGTH) trails.shift();
    });
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < trails.length; i++) {
      var t = trails[i];
      t.alpha *= TRAIL_FADE;
      t.size *= 0.96;
      if (t.alpha < 0.01) { trails.splice(i, 1); i--; continue; }
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.fillStyle = '#d6007a';
      ctx.globalAlpha = t.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
