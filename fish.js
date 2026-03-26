const container = document.getElementById("fish-area")

const FISH_COUNT = 80
const NUM_GROUPS = 8
const MAX_SPEED = 1.5

let mouse = { x: -9999, y: -9999 }

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX
  mouse.y = e.clientY + window.scrollY
})

// Clear existing fish from HTML and generate dynamically
const water = document.getElementById("water")
water.innerHTML = ""
for (let i = 0; i < FISH_COUNT; i++) {
  const div = document.createElement("div")
  div.className = "fish"
  const img = document.createElement("img")
  img.src = i % 2 === 0 ? "/fishy.png" : "/fishy2.png"
  div.appendChild(img)
  water.appendChild(div)
}

const fishElements = document.querySelectorAll(".fish")
let fish = []

function pageWidth()  { return document.documentElement.scrollWidth }
function pageHeight() { return document.documentElement.scrollHeight }

window.addEventListener("load", () => {
  const pw = pageWidth()
  const ph = pageHeight()

  fishElements.forEach((el, i) => {
    fish.push({
      el,
      x: Math.random() * pw,
      y: Math.random() * ph,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      group: Math.floor(i / (FISH_COUNT / NUM_GROUPS)),
      scared: false,
      calmTimer: 0
    })
  })

  animate()
})

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function animate() {
  const pw = pageWidth()
  const ph = pageHeight()

  fish.forEach(f => {
    // Mouse scare
    const dx = f.x - mouse.x
    const dy = f.y - mouse.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 120) {
      const angle = Math.atan2(dy, dx)
      f.vx = Math.cos(angle) * MAX_SPEED
      f.vy = Math.sin(angle) * MAX_SPEED
      f.scared = true
      f.calmTimer = 90
    }

    if (f.scared) {
      f.calmTimer--
      if (f.calmTimer <= 0) f.scared = false
    }

    // Local flocking — only care about nearby fish in the same group
    if (!f.scared) {
      let avgVX = 0, avgVY = 0, neighbors = 0
      let sepX = 0, sepY = 0

      fish.forEach(other => {
        if (other === f || other.group !== f.group) return
        const ddx = other.x - f.x
        const ddy = other.y - f.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)

        if (dist < 150) {
          // Alignment
          avgVX += other.vx
          avgVY += other.vy
          neighbors++
        }
        if (dist < 25) {
          // Separation
          sepX += (f.x - other.x)
          sepY += (f.y - other.y)
        }
      })

      if (neighbors > 0) {
        f.vx += ((avgVX / neighbors) - f.vx) * 0.04
        f.vy += ((avgVY / neighbors) - f.vy) * 0.04
      }

      f.vx += sepX * 0.008
      f.vy += sepY * 0.008

      // Random drift
      f.vx += (Math.random() - 0.5) * 0.05
      f.vy += (Math.random() - 0.5) * 0.05
    }

    // Cap speed
    const speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy)
    if (speed > MAX_SPEED) {
      f.vx = (f.vx / speed) * MAX_SPEED
      f.vy = (f.vy / speed) * MAX_SPEED
    }

    f.x += f.vx
    f.y += f.vy

    // Bounce off page edges
    if (f.x < 0)  { f.x = 0;  f.vx = Math.abs(f.vx) }
    if (f.x > pw) { f.x = pw; f.vx = -Math.abs(f.vx) }
    if (f.y < 0)  { f.y = 0;  f.vy = Math.abs(f.vy) }
    if (f.y > ph) { f.y = ph; f.vy = -Math.abs(f.vy) }

    const angle = Math.atan2(f.vy, f.vx)
    f.el.style.transform = `translate(${f.x}px, ${f.y}px) rotate(${angle}rad)`
  })

  requestAnimationFrame(animate)
}
