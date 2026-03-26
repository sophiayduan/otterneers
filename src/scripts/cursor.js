const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const MAX  = 10;
const points = [];
const mouse  = { x: -999, y: -999 };
const lerped = { x: -999, y: -999 };

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Subtle per-point jitter for hand-drawn feel
function jitter() { return (Math.random() - 0.5) * 0.6; }

(function animate() {
  requestAnimationFrame(animate);

  lerped.x += (mouse.x - lerped.x) * 0.35;
  lerped.y += (mouse.y - lerped.y) * 0.35;

  points.push({ x: lerped.x + jitter(), y: lerped.y + jitter() });
  if (points.length > MAX) points.shift();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (points.length < 3) return;

  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';

  // Draw smooth bezier segments, fading + thinning toward the tail
  for (let i = 1; i < points.length - 1; i++) {
    const t  = i / points.length;          // 0 = tail, 1 = head
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;

    ctx.beginPath();
    ctx.moveTo((points[i - 1].x + points[i].x) / 2,
               (points[i - 1].y + points[i].y) / 2);
    ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);

    // Slight width wobble for hand-drawn texture
    ctx.lineWidth   = t * 4.5 + jitter() * 0.4;
    ctx.strokeStyle = `rgba(137, 189, 158, ${t * 0.75})`;
    ctx.stroke();
  }
})();
