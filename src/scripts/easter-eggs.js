console.log("JavaScript has loaded");
var activeCountColour = "f1cc13";
var easterEggs = ["otter-heart-ascii", "konami-code", "bird-egg", "404-found", "mascot-images", "lutri-the-spellchaser", "read-and-find-out", "shaking-rock"];
var foundEasterEggs = [];
var eggCounter = document.getElementById("easter-eggs-counter");

// Confetti from bottom corners on egg found
var CONFETTI_COLORS = ['#459DE5','#1AE8E5','#89BD9E','#A89070','#2034ab','#EF9300','#FFFDF6','#AF97BA'];
var REPULSE_RADIUS = 90;
var REPULSE_FORCE  = 6;

function applyRepulsion(p, mx, my) {
    var dx = p.x - mx;
    var dy = p.y - my;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPULSE_RADIUS && dist > 0) {
        var strength = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
        p.vx += (dx / dist) * strength;
        p.vy += (dy / dist) * strength;
    }
}

function makeConfettiCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;cursor:none;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
}

function celebrateEgg() {
    var canvas = makeConfettiCanvas();
    var ctx = canvas.getContext('2d');
    var mouse = { x: -999, y: -999 };
    canvas.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    canvas.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });

    var particles = [];
    var COUNT = 120;
    for (var i = 0; i < COUNT; i++) {
        var fromLeft = i < COUNT / 2;
        var minDeg = fromLeft ? 35 : 95;
        var maxDeg = fromLeft ? 85 : 145;
        var deg = Math.random() * (maxDeg - minDeg) + minDeg;
        var rad = deg * Math.PI / 180;
        var speed = Math.random() * 14 + 8;
        particles.push({
            x: fromLeft ? 0 : canvas.width,
            y: canvas.height,
            vx: Math.cos(rad) * speed,
            vy: -Math.sin(rad) * speed,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            w: Math.random() * 10 + 5,
            h: Math.random() * 5 + 3,
            opacity: 1,
            flutter: Math.random() * 0.08 + 0.02,
            flutterOff: Math.random() * Math.PI * 2,
        });
    }

    var frame = 0;
    var GRAVITY = 0.45;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var alive = false;
        particles.forEach(function(p) {
            if (p.opacity <= 0) return;
            alive = true;
            applyRepulsion(p, mouse.x, mouse.y);
            p.vy += GRAVITY;
            p.vx += Math.sin(frame * p.flutter + p.flutterOff) * 0.25;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            if (p.y > canvas.height + 40 || frame > 100) p.opacity = Math.max(0, p.opacity - 0.025);
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        if (alive) requestAnimationFrame(animate);
        else canvas.remove();
    }
    requestAnimationFrame(animate);
}

// Confetti rain from above — all eggs found
function rainConfetti() {
    var canvas = makeConfettiCanvas();
    var ctx = canvas.getContext('2d');
    var mouse = { x: -999, y: -999 };
    canvas.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    canvas.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });

    var particles = [];
    var spawnFrames = 180;
    var frame = 0;

    function spawnBatch() {
        for (var i = 0; i < 8; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 4 + 3,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                w: Math.random() * 10 + 5,
                h: Math.random() * 5 + 3,
                opacity: 1,
                flutter: Math.random() * 0.06 + 0.02,
                flutterOff: Math.random() * Math.PI * 2,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (frame < spawnFrames) spawnBatch();
        var alive = false;
        particles.forEach(function(p) {
            if (p.opacity <= 0) return;
            alive = true;
            applyRepulsion(p, mouse.x, mouse.y);
            p.vx += Math.sin(frame * p.flutter + p.flutterOff) * 0.2;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            if (p.y > canvas.height + 20) p.opacity = Math.max(0, p.opacity - 0.04);
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        if (alive || frame < spawnFrames) requestAnimationFrame(animate);
        else canvas.remove();
    }
    requestAnimationFrame(animate);
}

//need to set the counter
displayCounter();
//give rocks functions
function giveRocks(easterEggNum) {
    var egg = easterEggs[easterEggNum];
    foundEasterEggs = JSON.parse(sessionStorage.getItem("easter-eggs")) || [];
    if (egg === undefined) {
        return;
    }
    var alreadyHas = foundEasterEggs.indexOf(egg) !== -1;
    if (alreadyHas) {
        return;
    }
    foundEasterEggs.push(egg);
    sessionStorage.setItem("easter-eggs", JSON.stringify(foundEasterEggs));
    displayCounter();
    if (foundEasterEggs.length >= 8) {
        rainConfetti();
    } else {
        celebrateEgg();
    }
}
function displayCounter() {
    foundEasterEggs = JSON.parse(sessionStorage.getItem("easter-eggs")) || [];
    var numEasterEggs = foundEasterEggs.length;
    if (eggCounter) eggCounter.textContent = numEasterEggs + "/8";
    var easterEggDots = document.querySelectorAll("#easter-egg-dots li");
    for (var i = 0; i < easterEggDots.length; i++) {
        var path = easterEggDots[i].querySelector("path");
        if (i < numEasterEggs) {
            easterEggDots[i].style.backgroundColor = "white";
            easterEggDots[i].style.borderColor = "#2034ab";
            // if (path) path.style.stroke = "#FFFFFF";
        } else {
            easterEggDots[i].style.backgroundColor = "";
            easterEggDots[i].style.borderColor = "#2034ab";
        }
    }
}
var lutriText = "Companion — Each nonland card in your starting deck has a different name. (If this card is your chosen companion, you may put it into your hand from outside the game for {3} as a sorcery.)\nFlash\nWhen Lutri enters, if you cast it, copy target instant or sorcery spell you control. You may choose new targets for the copy.";
//easter egg 1, otter heart ascii
var otterHeartAscii = "-------------------------------=%@@*=---------------------------------------------------------------\n" +
    "----##%%%###+=----------------+%:+##@%@@@%%%%@@@%*=-------------------------------------------------\n" +
    "-------------=+#@@%#=:--------%*..#%*#************#@@%=---------------------------------------------\n" +
    "---------------------+@@%=--+%@*%%#***+*************+*#@@+------------------------------------------\n" +
    "-------------------------+@@@#*****+*+++**+**************%@#----------------------------------------\n" +
    "-------------===------=%@%*+++#@@#**+*@##*+***************+%@*--------------------------------------\n" +
    "--------=%##*++=++**%@@@@@%#****=-#%-.-=#@@#*****************%@=------------------------------------\n" +
    "------------------*@%*+*****##%@#=..-@*...#@#*****************#@*-----------------------------------\n" +
    "--------=#%%@@@%@@@%%%@@@@@@%*:..:#@#:=@-.=@#*******************@*----------------------------------\n" +
    "----+@@*=------@%#+********:.::+@@%@#%+:@--@%%*******************@=---------------------------------\n" +
    "--+@=--------#@#**********:......=@%@-:......:+**##**************@%+--------------------------------\n" +
    "-----------=@%*********+*:......::@+-%:........#@@@@@@%**********@#*@=------------------------------\n" +
    "----------#@#***********=....:::+@@@*:::.......+@@@@@@@@%*@%@@@%*@#*@+------------------------------\n" +
    "---------%@**+*******+*+..:::*@@@#**@%-:::......:%@@@@@@@-%+-::#@@#+====----------------------------\n" +
    "--------@%*+*********+#@=::*@@*++++++*%@+:::::.....-#%%*:......*@@*++===++*#@@%##%#+=---------------\n" +
    "-------%%************+%@=-@@#+++++++++++#@@%=::::::.............:@**#%%%%@@@@@@%%%@@@@@%+-----------\n" +
    "------%%**+***********%@*@@*+++++++++++++++#@@@@@@@+::.........:#@=--*@@%*++==++++==+++%@@#---------\n" +
    "-----#@***************#@@@+++++++++===+++++++++++*@@@=::::.:.:*%@%@@@%+=+=+++==-----=====*@@*-------\n" +
    "----*@#****************@@#++++++++===========+++++++%@@%*++==*@%*@@#=+=+=+=+=-----------==+%@%------\n" +
    "---=@#******************%@@@@@@@@@%##@*==+======+++++++*####**@@@*=+====+=++-------------=++#@#-----\n" +
    "---%@********************************%%++==========+++++++=+===+++=+=====++==-------------=+=#@+----\n" +
    "--+@#******************+****************#@#=========+===++++=+====+======+=+=--------------=+=%%----\n" +
    "--%%******#%*****************************@#===================================--------------+++@+---\n" +
    "-+@#******#@#***************************%%+===================================--------------===%%---\n" +
    "-%@********%@*****************************@+=================================+---------------=+#@---\n" +
    "-@%*********@@**************************@#*=+================================+=--------------==#@=--\n" +
    "=@#**********%@%**************#%%#***#%@%=+====================================--------------==#@---\n" +
    "+@#************%@@*********#@@#*+#@@@@#==+===================================+=--------------==#@---\n" +
    "*@*************-:=%@@@@@@@@*+++=====+=+======================================+=-------------==+%@---\n" +
    "*@*************::::::::-@@+++++**+=+===+=====================================+=------------==++@%---\n" +
    "*@*************:::::::::%@#***@%#@+++=+======================================+++=----------===#@*---\n" +
    "+@#************:..::::::+@@#%@#**%%##@+=======================================+=+=-------===++@@=---\n" +
    "=@#************=...:::::-@%**********@+====+=====================================+===---=+=+++@#----\n" +
    "-@%*************:...::::+@************#@+=+======================================++===++=+==+@@=----\n" +
    "-%@*************+....:::+@************%@++++================================================#@*-----\n" +
    "-+@#*************+=%@@@@%@***********#@*=+=+===========================================+=+=#@@------\n" +
    "--%@***********%@@#*****************#@+++=============================================+++=*@@=------\n" +
    "--=@%*********@@#******************%@+================================================+++*@@+-------\n" +
    "---*@#*******%@#******************%%+++===============================================+=*@@+--------\n" +
    "----%@#****#*%@******************@%+*++==+========================================+++++#@@=---------\n" +
    "-----%@#*****%@*****************%@#++++++==+=====================================+==+=%@@=----------\n" +
    "------#@#****#@#****************#@@@*++++++======================================+==+@@%------------\n" +
    "-------*@%*#**#@*****************@@@@%*++++++==================================+===#@@*-------------\n" +
    "--------=@@#***#@#***************%@*#@@#++++++==+============================++==+@@@=--------------\n" +
    "----------#@@********************%@***%@@#++++++===========================++=++#@@*----------------\n" +
    "-----------=%@@#****************#@#***#*%@@%+++**+++====================+=++=+*@@#------------------\n" +
    "--------------%@@#*************#@#******#*%@@%*+++++++==================+=+=+@@%--------------------\n" +
    "----------------*@@@##*#******##*#*********##@@@*++++++++=+++======++=+==+*@@#----------------------\n" +
    "------------------=#@@@#**********************#%@@%+++++++++++=====++==+#@@*------------------------\n" +
    "----------------------*%@@@%#********************%@@@#*+++++++++++==++%@%=--------------------------\n" +
    "--------------------------=*@@@@@%%##*************##@@@@#+++++++++*%@@*-----------------------------\n" +
    "--------------------------------=++#%@@@@@@@@@@@%#*+==+%@@@%***#@@@*--------------------------------\n" +
    " __          __    _   _     _       _                        _                               \n" +
    " \\ \\        / /   | | | |   (_)     | |                      ( )                              \n" +
    "  \\ \\  /\\  / /__  | |_| |__  _ _ __ | | __  _   _  ___  _   _|/ _ __ ___                      \n" +
    "   \\ \\/  \\/ / _ \\ | __| '_ \\| | '_ \\| |/ / | | | |/ _ \\| | | | | '__/ _ \\                     \n" +
    "    \\  /\\  /  __/ | |_| | | | | | | |   <  | |_| | (_) | |_| | | | |  __/                     \n" +
    "     \\/  \\/ \\___|  \\__|_| |_|_|_| |_|_|\\_\\  \\__, |\\___/ \\__,_| |_|  \\___|                     \n" +
    "                                             __/ |                                            \n" +
    "   ____ _______ _______ ______ _____  _  __ |___/_                            _             _ \n" +
    "  / __ \\__   __|__   __|  ____|  __ \\| | \\ \\   / /                           (_)           | |\n" +
    " | |  | | | |     | |  | |__  | |__) | |  \\ \\_/ /    __ _ _ __ ___   __ _ _____ _ __   __ _| |\n" +
    " | |  | | | |     | |  |  __| |  _  /| |   \\   /    / _` | '_ ` _ \\ / _` |_  / | '_ \\ / _` | |\n" +
    " | |__| | | |     | |  | |____| | \\ \\| |____| |    | (_| | | | | | | (_| |/ /| | | | | (_| |_|\n" +
    "  \\____/  |_|     |_|  |______|_|  \\_\\______|_|     \\__,_|_| |_| |_|\\__,_/___|_|_| |_|\\__, (_)\n" +
    "                                                                                       __/ |  \n" +
    "                                                                                      |___/   \n";
console.log(otterHeartAscii);
var site_heading = document.getElementById("site-heading");
if (site_heading) {
    site_heading.addEventListener("click", function () {
        console.log(otterHeartAscii);
        giveRocks(0);
    });
}

document.addEventListener("keyup", function (event) {
    //console.log("stuff and things, key up, etc.");
    if (event.defaultPrevented) {
        return;
    }
    konamiCode(event);
    switch (event.key) {
    }
});
//konami code stuff
var konamiCodeKeys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
var konamiCodeNum = 0;
var konamiCodeActive = false;
function lightKonamiDot(index) {
    var dots = document.querySelectorAll("#easter-egg-dots li");
    if (dots[index]) {
        dots[index].style.setProperty("border-color", "white", "important");
        var path = dots[index].querySelector("path");
        if (path) path.style.setProperty("stroke", "white", "important");
    }
}
function resetKonamiDots() {
    document.querySelectorAll("#easter-egg-dots li").forEach(function(dot) {
        dot.style.removeProperty("border-color");
        dot.style.removeProperty("background-color");
        var path = dot.querySelector("path");
        if (path) path.style.removeProperty("stroke");
    });
}
function setAllDotsWhite() {
    document.querySelectorAll("#easter-egg-dots li").forEach(function(dot) {
        dot.style.setProperty("border-color", "white", "important");
        dot.style.setProperty("background-color", "white", "important");
        var path = dot.querySelector("path");
        if (path) path.style.setProperty("stroke", "white", "important");
    });
}
function flashKonamiDots(flashes, interval, onDone) {
    var count = 0;
    var total = flashes * 2;
    var id = setInterval(function() {
        if (count % 2 === 0) setAllDotsWhite();
        else resetKonamiDots();
        count++;
        if (count >= total) {
            clearInterval(id);
            resetKonamiDots();
            if (onDone) onDone();
        }
    }, interval);
}
function konamiCode(event) {
    if (event.key === konamiCodeKeys[konamiCodeNum]) {
        lightKonamiDot(konamiCodeNum);
        if (konamiCodeNum === konamiCodeKeys.length - 1) {
            konamiCodeActive = true;
            konamiCodeNum = 0;
            giveRocks(1);
            flashKonamiDots(4, 120, displayCounter);
        } else {
            konamiCodeNum++;
        }
    } else {
        konamiCodeNum = 0;
        resetKonamiDots();
    }
}
var mascotPostClick = 0;
document.addEventListener("click", function (event) {
    if (konamiCodeActive) {
        var span = document.createElement('span');
        span.textContent = "❤️";
        span.className = 'emoji click-emoji';
        span.style.left = event.clientX + 'px';
        span.style.top = event.clientY + 'px';
        span.style.position = 'fixed';
        document.body.appendChild(span);
    }
    if (isMascotImg) {
        mascotPostClick++;
        if (mascotPostClick > 1) {
            isMascotImg = false;
            var mascots_1 = document.querySelectorAll(".mascot-img");
            mascots_1.forEach(function (img) {
                img.remove();
            });
            mascotPostClick = 0;
        }
    }
});
//easter egg 2
//triple-click on the bird
// var bird = document.getElementById("bird");
// bird.addEventListener("click", function (event) {
//     if (event.detail === 3) {
//         giveRocks(2);
//     }
// });
//easter egg 3 is 404 not found
//easter eggs 4 and 5
//select text for a photo to pop up
document.addEventListener('mouseup', function () {
    //console.log("fired");
    var selection = document.getSelection();
    var selectedText = selection ? selection.toString() : null;
    //console.log(selectedText);
    if ((selectedText) === "Lulu" || selectedText === "Lutri Lutri") {
        // Add if you selected my name
        //mainIntro.appendChild(profileImage);
        var luluArray = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg", "Lulu-sit.jpg"];
        displayMascotImg(luluArray);
        giveRocks(4);
    }
    else if (selectedText === "Bria") {
        var briaArray = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg"];
        displayMascotImg(briaArray);
        giveRocks(4);
    }
    else if (selectedText === "Lutri" || selectedText === "Lutri ") {
        //console.log("Lutri the spellchaser?");
        var lutriArray = ["lutri-the-spellchaser.webp", "lutri-the-spellchaser-alt.jpg"];
        displayMascotImg(lutriArray);
        giveRocks(5);
    }
});
var isMascotImg = false;
function displayMascotImg(imgSourceArray) {
    isMascotImg = true;
    var imgSource = "/otters/" + imgSourceArray[Math.floor(Math.random() * imgSourceArray.length)];
    var img = document.createElement("img");
    img.src = imgSource;
    img.classList.add("mascot-img");
    //scale, random rotation, and random offset
    var rotation = Math.random() * 360;
    img.style.width = "60%";
    img.style.transform = "translate(-50%, -50%) rotate(".concat(rotation, "deg)");
    document.body.appendChild(img);
}
window.addEventListener("scroll", function () {
    if (isMascotImg) {
        isMascotImg = false;
        var mascots = document.querySelectorAll(".mascot-img");
        mascots.forEach(function (img) {
            img.remove();
        });
    }
    if (konamiCodeActive) {
        var emojis = document.querySelectorAll(".mascot-emoji");
        emojis.forEach(function (emoji) {
            emoji.remove();
        });
    }
});
// Easter egg 4 — click the mascots credit text
var mascotsText = document.getElementById("mascots-text");
if (mascotsText) {
    mascotsText.addEventListener("click", function () {
        var briaArray = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg"];
        displayMascotImg(briaArray);
        giveRocks(4);
    });
}
// Easter egg 7 — triple-click the shaking rock
var shakingRock = document.getElementById("shaking-rock");
if (shakingRock) {
    shakingRock.addEventListener("click", function (event) {
        if (event.detail === 3) {
            shakingRock.classList.toggle('paused');
            giveRocks(7);
            var container = document.body;
            container.classList.remove('apply-shake');
            void container.offsetWidth; // force reflow to restart animation
            container.classList.add('apply-shake');
        }
    });
}
