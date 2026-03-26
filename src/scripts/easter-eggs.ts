console.log("JavaScript has loaded");

const easterEggs: readonly string[] = ["otter-heart-ascii", "konami-code", "bird-egg", "404-found", "read-and-find-out", "mascot-images", "lutri-the-spellchaser"];
let foundEasterEggs: string[] = [];

const eggCounter:HTMLSpanElement = document.getElementById("easter-eggs-counter");

//give rocks functions
function giveRocks(easterEggNum: number) {
    const egg = easterEggs[easterEggNum];
    foundEasterEggs = JSON.parse(sessionStorage.getItem("easter-eggs")) || [];

    if (egg === undefined) {
        return;
    }

    const alreadyHas: boolean = foundEasterEggs.indexOf(egg) !== -1;

    if (alreadyHas) {
        return;
    }

    foundEasterEggs.push(egg);
    sessionStorage.setItem("easter-eggs", JSON.stringify(foundEasterEggs));

    displayCounter();
}

function displayCounter() {
    foundEasterEggs = JSON.parse(sessionStorage.getItem("easter-eggs")) || [];
    const numEasterEggs = foundEasterEggs.length;
    if (eggCounter) eggCounter.textContent = numEasterEggs + "/6";

    const easterEggDots:NodeListOf<HTMLLIElement> = document.querySelectorAll("#easter-egg-dots li");
    for (var i = 0; i < easterEggDots.length; i++) {
        if (i < numEasterEggs) {
            easterEggDots[i].classList.remove("bg-beige");
            easterEggDots[i].style.backgroundColor = "#89BD9E";
        } else {
            easterEggDots[i].style.backgroundColor = "";
            easterEggDots[i].classList.add("bg-beige");
        }
    }
}

const lutriText: string = "Companion — Each nonland card in your starting deck has a different name. (If this card is your chosen companion, you may put it into your hand from outside the game for {3} as a sorcery.)\nFlash\nWhen Lutri enters, if you cast it, copy target instant or sorcery spell you control. You may choose new targets for the copy.";

//easter egg 1, otter heart ascii
const otterHeartAscii: string =
    "-------------------------------=%@@*=---------------------------------------------------------------\n" +
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

const site_heading: HTMLElement = document.getElementById("site-heading");

site_heading.addEventListener("click", function () {
    console.log(otterHeartAscii);

    //give player rocks!
    giveRocks(0);
});

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
const konamiCodeKeys: readonly string[] = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiCodeNum: number = 0;
let konamiCodeActive:boolean = false;

function konamiCode(event: KeyboardEvent) {
    if (event.key === konamiCodeKeys[konamiCodeNum]) {
        if (event.key === konamiCodeKeys[konamiCodeKeys.length - 1]) {
            //console.log("Konami Code test complete");
            konamiCodeActive = true;
            konamiCodeNum = 0;
            giveRocks(1);
        } else {
            console.log("Konami Code test" + konamiCodeNum);
            konamiCodeNum++;
        }
    } else {
        konamiCodeNum = 0;
    }
}

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
        isMascotImg = false;
        const mascots = document.querySelectorAll(".mascot-img");

        mascots.forEach(img => {
            img.remove();
        });
    }
});

//easter egg 2
//triple-click on the bird
// const bird: HTMLElement = document.getElementById("bird");
// bird.addEventListener("click", function (event: MouseEvent) {
//     if (event.detail === 3) {
//         giveRocks(2);
//     }
// });

//easter egg 3 is 404 not found

//easter eggs 4 and 5
//select text for a photo to pop up
document.addEventListener('mouseup', function() {
    //console.log("fired");
    const selection = document.getSelection();
    const selectedText = selection ? selection.toString() : null;

    //console.log(selectedText);
    if ((selectedText)==="Lulu" || selectedText==="Lutri Lutri") {
        // Add if you selected my name
        //mainIntro.appendChild(profileImage);
        const luluArray: readonly string[] = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg", "Lulu-sit.jpg"];
        displayMascotImg(luluArray);
        giveRocks(4);
    } else if (selectedText==="Bria") {
        const briaArray: readonly string[] = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg"];
        displayMascotImg(briaArray);
        giveRocks(4);
    } else if (selectedText==="Lutri" || selectedText==="Lutri ") {
        //console.log("Lutri the spellchaser?");
        const lutriArray: readonly string[] = ["lutri-the-spellchaser.webp", "lutri-the-spellchaser-alt.jpg"];
        displayMascotImg(lutriArray);
        giveRocks(5);
    }
});

let isMascotImg: boolean = false;

function displayMascotImg(imgSourceArray: readonly string[]){
    isMascotImg = true;

    const imgSource: string = "/otters/" + imgSourceArray[Math.floor(Math.random() * imgSourceArray.length)];

    const img= document.createElement("img");
    img.src = imgSource;

    img.classList.add("mascot-img");

    //scale, random rotation, and random offset
    const rotation: number = Math.random() * 360;

    img.style.width = "40%";
    img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    document.body.appendChild(img);
}

const mascots = document.getElementById("mascots");

mascots.addEventListener("click", function () {
    const briaArray: readonly string[] = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg"];
    displayMascotImg(briaArray);
    giveRocks(4);
});

window.addEventListener("click", () => {
    if (isMascotImg) {
        isMascotImg = false;
        const mascots = document.querySelectorAll(".mascot-img");

        mascots.forEach(img => {
            img.remove();
        });
    }


});