(function() {
  var canvas, ctx;
  var stars = [];
  var mouse = { x: -1000, y: -1000 };
  var scrollProgress = 0;
  var rotationY = 0;
  var STAR_COUNT = 1700;
  var FOV = 600;
  var CENTER_X, CENTER_Y;
  var COLORS = ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#aaccff','#ffddaa','#aaffee'];

  function init() {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.92';
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');
    resize();
    for (var i = 0; i < STAR_COUNT; i++) stars.push(createStar(i));
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', function() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = docH > 0 ? Math.min(1, window.pageYOffset / docH) : 0;
    });
    document.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CENTER_X = canvas.width / 2;
    CENTER_Y = canvas.height / 2;
  }

  function createStar(i) {
    var type, x, y, z, baseSize, baseAlpha, orbitSpeed, color;
    color = COLORS[Math.floor(Math.random() * COLORS.length)];

    if (i < 300) {
      type = 'disk-close';
      var a = Math.random() * Math.PI * 2;
      var r = 50 + Math.random() * 200;
      x = Math.cos(a) * r;
      y = (Math.random() - 0.5) * 180;
      z = Math.sin(a) * r;
      baseSize = 0.8 + Math.random() * 1.5;
      baseAlpha = 0.4 + Math.random() * 0.5;
      orbitSpeed = 0.0004 + Math.random() * 0.0006;
    } else if (i < 600) {
      type = 'disk-mid';
      var a = Math.random() * Math.PI * 2;
      var r = 150 + Math.random() * 350;
      x = Math.cos(a) * r;
      y = (Math.random() - 0.5) * 280;
      z = Math.sin(a) * r;
      baseSize = 0.5 + Math.random() * 1.0;
      baseAlpha = 0.3 + Math.random() * 0.4;
      orbitSpeed = 0.0002 + Math.random() * 0.0004;
    } else if (i < 800) {
      type = 'disk-far';
      var a = Math.random() * Math.PI * 2;
      var r = 300 + Math.random() * 500;
      x = Math.cos(a) * r;
      y = (Math.random() - 0.5) * 380;
      z = Math.sin(a) * r;
      baseSize = 0.3 + Math.random() * 0.7;
      baseAlpha = 0.2 + Math.random() * 0.3;
      orbitSpeed = 0.0001 + Math.random() * 0.00025;
    } else if (i < 1200) {
      type = 'halo';
      var a = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 200 + Math.random() * 600;
      x = r * Math.sin(phi) * Math.cos(a);
      y = r * Math.sin(phi) * Math.sin(a) * 0.7;
      z = r * Math.cos(phi);
      baseSize = 0.2 + Math.random() * 0.8;
      baseAlpha = 0.15 + Math.random() * 0.35;
      orbitSpeed = 0.00008 + Math.random() * 0.0002;
    } else {
      type = 'bg';
      x = (Math.random() - 0.5) * 2000;
      y = (Math.random() - 0.5) * 1800;
      z = 400 + Math.random() * 800;
      baseSize = 0.2 + Math.random() * 0.5;
      baseAlpha = 0.1 + Math.random() * 0.25;
      orbitSpeed = 0.00003 + Math.random() * 0.00008;
    }

    return { x: x, y: y, z: z, baseSize: baseSize, baseAlpha: baseAlpha, orbitSpeed: orbitSpeed, color: color, type: type, angle: Math.atan2(z, x) };
  }

  function rotateY(x, z, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return { x: x * cos - z * sin, z: x * sin + z * cos };
  }

  function rotateX(y, z, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return { y: y * cos - z * sin, z: y * sin + z * cos };
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rotationY += 0.0003;

    var viewAngleX = scrollProgress * 0.45;
    var sorted = [];

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.angle += s.orbitSpeed;
      var dist = Math.sqrt(s.x * s.x + s.z * s.z);
      var angularSpeed = s.orbitSpeed * (dist < 100 ? 3 : dist < 300 ? 1.5 : 1);
      var a = s.angle + angularSpeed;

      if (s.type !== 'bg') {
        var r = Math.sqrt(s.x * s.x + s.z * s.z);
        s.x = Math.cos(a) * r;
        s.z = Math.sin(a) * r;
      }

      var rx = rotateY(s.x, s.z, rotationY);
      var ry = rotateX(s.y, rx.z, viewAngleX);

      var dx = mouse.x - CENTER_X;
      var dy = mouse.y - CENTER_Y;
      var mDist = Math.sqrt(dx * dx + dy * dy);
      if (mDist < 200) {
        var mForce = (200 - mDist) / 200;
        rx.x -= (dx / (mDist + 1)) * mForce * 8;
        ry.y -= (dy / (mDist + 1)) * mForce * 5;
      }

      var scale = FOV / (ry.z + FOV + 100);
      var screenX = CENTER_X + rx.x * scale;
      var screenY = CENTER_Y + ry.y * scale;
      var screenSize = s.baseSize * scale;
      var screenAlpha = s.baseAlpha * Math.min(1, scale * 1.5);

      if (screenX > -50 && screenX < canvas.width + 50 && screenY > -50 && screenY < canvas.height + 50) {
        sorted.push({ x: screenX, y: screenY, size: screenSize, alpha: screenAlpha, color: s.color, z: ry.z, type: s.type });
      }
    }

    sorted.sort(function(a, b) { return b.z - a.z; });

    for (var j = 0; j < sorted.length; j++) {
      var p = sorted[j];
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.3, p.size), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(0.9, Math.max(0.05, p.alpha));
      ctx.fill();

      if (p.type === 'disk-close' && p.size > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.05;
        ctx.fill();
      }
    }

    var grd = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, canvas.width * 0.4);
    grd.addColorStop(0, 'rgba(10,10,10,0.12)');
    grd.addColorStop(0.3, 'rgba(10,10,10,0.06)');
    grd.addColorStop(1, 'rgba(10,10,10,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();