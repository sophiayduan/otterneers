const water = document.getElementById("water")
const container = document.getElementById("fish-area")
const containerRect = container.getBoundingClientRect()

let mouse = {x:0, y:0}

document.addEventListener("mousemove", e=>{
  mouse.x = e.clientX
  mouse.y = e.clientY
})

let fish = []

for(let i=0;i<40;i++){

  let el = document.createElement("div")
  el.classList.add("fish")

  let group = i < 20 ? 0 : 1
  el.classList.add("group"+group)

  water.appendChild(el)

  fish.push({
    el,
    x: Math.random()*containerRect.width,
    y: Math.random()*containerRect.height,
    vx: (Math.random()-0.5)*1,
    vy: (Math.random()-0.5)*1,
    group,
    scared:false,
    calmTimer:0
  })
}

function animate(){

  fish.forEach(f => {

    let dx = f.x - mouse.x
    let dy = f.y - mouse.y
    let distance = Math.sqrt(dx*dx + dy*dy)

    //fish panic and scatter
    if(distance < 120){

      let angle = Math.atan2(dy,dx)

      f.vx = Math.cos(angle)*2
      f.vy = Math.sin(angle)*2

      f.scared = true
      f.calmTimer = 90
    }

    if(f.scared){
      f.calmTimer--
      if(f.calmTimer <= 0){
        f.scared = false
      }
    }

    //keep fish together in groups
    if(!f.scared){

      let centerX = 0
      let centerY = 0
      let count = 0

      let avgVX = 0
      let avgVY = 0
      let neighbors = 0

      fish.forEach(other => {

        if(other.group === f.group){

          centerX += other.x
          centerY += other.y
          count++

          let dx = other.x - f.x
          let dy = other.y - f.y
          let dist = Math.sqrt(dx*dx + dy*dy)

          if(dist < 80){
            avgVX += other.vx
            avgVY += other.vy
            neighbors++
          }

          if(other !== f && dist < 20){
            f.vx += (f.x - other.x) * 0.01
            f.vy += (f.y - other.y) * 0.01
          }

        }

      })

      centerX /= count
      centerY /= count

      f.vx += (centerX - f.x) * 0.00005
      f.vy += (centerY - f.y) * 0.00005

      //all fish move in same direction
      if(neighbors > 0){
        avgVX /= neighbors
        avgVY /= neighbors

        f.vx += (avgVX - f.vx) * 0.05
        f.vy += (avgVY - f.vy) * 0.05
      }

      f.vx += (Math.random()-0.5)*0.02
      f.vy += (Math.random()-0.5)*0.02
    }

    f.x += f.vx
    f.y += f.vy

    if(f.x < 0 || f.x > containerRect.width) f.vx *= -1
    if(f.y < 0 || f.y > containerRect.height) f.vy *= -1

    let angle = Math.atan2(f.vy, f.vx)

    f.el.style.transform =
      `translate(${f.x}px, ${f.y}px) rotate(${angle}rad)`

  })

  requestAnimationFrame(animate)
}

animate()